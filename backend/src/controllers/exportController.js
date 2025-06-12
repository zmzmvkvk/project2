const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

// FFmpeg 경로 설정
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// 이미지 시퀀스 생성을 위한 임시 디렉토리
const TEMP_DIR = path.join(__dirname, "../../temp");

// 이미지 시퀀스 생성 컨트롤러
const generateImageSequence = async (req, res) => {
  try {
    const { scenes } = req.body; // 조립된 콘텐츠 구조에서 장면 배열을 받음

    if (!scenes || !Array.isArray(scenes)) {
      return res
        .status(400)
        .json({ error: "유효하지 않은 장면 데이터입니다." });
    }

    // 임시 디렉토리 생성
    const sequenceId = uuidv4();
    const sequenceDir = path.join(TEMP_DIR, sequenceId);
    await fs.mkdir(sequenceDir, { recursive: true });

    // 각 장면의 이미지를 다운로드하고 저장
    const imagePaths = [];
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (scene.imageUrl) {
        const imageResponse = await axios.get(scene.imageUrl, {
          responseType: "arraybuffer",
        });
        const imagePath = path.join(sequenceDir, `scene_${i + 1}.jpg`);
        await fs.writeFile(imagePath, imageResponse.data);
        imagePaths.push(imagePath);
      }
    }

    // ZIP 파일 생성
    const zipPath = path.join(TEMP_DIR, `${sequenceId}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      // ZIP 파일 생성 완료 후 임시 이미지 파일들 삭제
      Promise.all(imagePaths.map((path) => fs.unlink(path)))
        .then(() => fs.rmdir(sequenceDir))
        .catch(console.error);

      // ZIP 파일 다운로드 링크 반환
      res.json({
        success: true,
        downloadUrl: `/api/export/download/${sequenceId}.zip`,
      });
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);
    imagePaths.forEach((imagePath) => {
      archive.file(imagePath, { name: path.basename(imagePath) });
    });
    await archive.finalize();
  } catch (error) {
    console.error("이미지 시퀀스 생성 중 오류:", error);
    res
      .status(500)
      .json({ error: "이미지 시퀀스 생성 중 오류가 발생했습니다." });
  }
};

// 비디오 생성 컨트롤러
const generateVideo = async (req, res) => {
  try {
    const { scenes, options = {} } = req.body;
    const {
      fps = 30,
      duration = 3, // 각 장면의 지속 시간 (초)
      resolution = "1080p", // '720p', '1080p', '4k'
      format = "mp4",
      audioUrl = null, // 새로운 옵션: 배경 음악 URL
    } = options;

    if (!scenes || !Array.isArray(scenes)) {
      return res
        .status(400)
        .json({ error: "유효하지 않은 장면 데이터입니다." });
    }

    // 임시 디렉토리 생성
    const videoId = uuidv4();
    const videoDir = path.join(TEMP_DIR, videoId);
    await fs.mkdir(videoDir, { recursive: true });

    // 각 장면의 이미지를 다운로드하고 저장
    const imagePaths = [];
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (scene.imageUrl) {
        const imageResponse = await axios.get(scene.imageUrl, {
          responseType: "arraybuffer",
        });
        const imagePath = path.join(videoDir, `scene_${i + 1}.jpg`);
        await fs.writeFile(imagePath, imageResponse.data);
        imagePaths.push(imagePath);
      }
    }

    let audioFilePath = null;
    if (audioUrl) {
      try {
        const audioResponse = await axios.get(audioUrl, {
          responseType: "arraybuffer",
        });
        const audioFilename = `audio_${uuidv4()}.${
          audioUrl.split(".").pop().split("?")[0]
        }`;
        audioFilePath = path.join(videoDir, audioFilename);
        await fs.writeFile(audioFilePath, audioResponse.data);
        console.log(`[FFmpeg] Audio file downloaded to ${audioFilePath}`);
      } catch (audioError) {
        console.error("오디오 파일 다운로드 중 오류:", audioError);
        // 오디오 다운로드 실패 시에도 비디오 생성은 진행 (오디오 없이)
        audioFilePath = null;
      }
    }

    // 해상도 설정
    const resolutionMap = {
      "720p": { width: 1280, height: 720 },
      "1080p": { width: 1920, height: 1080 },
      "4k": { width: 3840, height: 2160 },
    };
    const { width, height } =
      resolutionMap[resolution] || resolutionMap["1080p"];

    // 비디오 생성
    const outputPath = path.join(TEMP_DIR, `${videoId}.${format}`);

    return new Promise((resolve, reject) => {
      let command = ffmpeg();

      // 입력 이미지 추가
      imagePaths.forEach((imagePath) => {
        command = command.input(imagePath);
      });

      command.inputOptions([`-framerate ${fps}`, "-pattern_type sequence"]);

      // 오디오 입력 추가
      if (audioFilePath) {
        command.input(audioFilePath);
      }

      command
        .outputOptions([
          `-vf scale=${width}:${height}`,
          `-t ${duration * scenes.length}`,
          "-c:v libx264",
          "-pix_fmt yuv420p",
          "-preset medium",
          "-crf 23",
          ...(audioFilePath
            ? ["-c:a aac", "-b:a 128k", "-map 0:v:0", "-map 1:a:0"]
            : []),
        ])
        .output(outputPath)
        .on("end", async () => {
          // 임시 파일들 삭제
          try {
            await Promise.all(imagePaths.map((path) => fs.unlink(path)));
            if (audioFilePath) {
              await fs.unlink(audioFilePath);
            }
            await fs.rmdir(videoDir);

            res.json({
              success: true,
              downloadUrl: `/api/export/download/${videoId}.${format}`,
            });
            resolve();
          } catch (error) {
            console.error("임시 파일 정리 중 오류:", error);
            reject(error);
          }
        })
        .on("error", (err) => {
          console.error("비디오 생성 중 오류:", err);
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error("비디오 생성 중 오류:", error);
    res.status(500).json({ error: "비디오 생성 중 오류가 발생했습니다." });
  }
};

module.exports = {
  generateImageSequence,
  generateVideo,
};
