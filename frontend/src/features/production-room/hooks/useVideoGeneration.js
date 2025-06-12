import { useState, useRef, useEffect } from "react";
import axios from "axios";

export const useVideoGeneration = (images, saveGeneratedContentToProject) => {
  const [videoImageId, setVideoImageId] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [transitionType, setTransitionType] = useState("fade");
  const [transitionDuration, setTransitionDuration] = useState(0.5);
  const [textOverlayContent, setTextOverlayContent] = useState("");
  const [textOverlayPosition, setTextOverlayPosition] = useState("bottom");
  const [enableSubtitles, setEnableSubtitles] = useState(false);
  const [subtitleLanguage, setSubtitleLanguage] = useState("ko-KR");
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState("");
  const videoPollingIntervalRef = useRef(null);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (videoPollingIntervalRef.current) {
        clearInterval(videoPollingIntervalRef.current);
      }
    };
  }, []);

  // 영상 생성 폴링
  const startVideoPolling = (generationId) => {
    if (videoPollingIntervalRef.current) {
      clearInterval(videoPollingIntervalRef.current);
    }

    videoPollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `/api/generate/video-status/${generationId}`
        );

        if (
          statusResponse.data.status === "COMPLETE" &&
          statusResponse.data.videoUrl
        ) {
          const videoUrl = statusResponse.data.videoUrl;
          setIsVideoLoading(false);
          clearInterval(videoPollingIntervalRef.current);
          videoPollingIntervalRef.current = null;
          if (saveGeneratedContentToProject) {
            saveGeneratedContentToProject(videoUrl);
          }
        } else if (statusResponse.data.status === "PENDING") {
          // setGeneratedContent(`영상 생성 중... (ID: ${generationId})`);
        } else {
          setVideoError("영상 생성 상태를 확인할 수 없습니다.");
          setIsVideoLoading(false);
          clearInterval(videoPollingIntervalRef.current);
          videoPollingIntervalRef.current = null;
        }
      } catch (pollErr) {
        console.error("영상 폴링 중 오류 발생:", pollErr);
        setVideoError(
          "영상 상태 확인 중 오류 발생: " +
            (pollErr.response?.data?.message || pollErr.message)
        );
        setIsVideoLoading(false);
        clearInterval(videoPollingIntervalRef.current);
        videoPollingIntervalRef.current = null;
      }
    }, 3000);
  };

  // 영상 생성
  const handleGenerateVideo = async () => {
    if (!videoImageId) {
      alert("영상을 생성할 이미지 ID를 입력해주세요.");
      return;
    }

    setIsVideoLoading(true);
    setVideoError(null);

    try {
      const response = await axios.post("/api/generate/video", {
        imageId: videoImageId,
        prompt: videoPrompt,
        options: {
          transitionType,
          transitionDuration,
          textOverlayContent,
          textOverlayPosition,
          enableSubtitles,
          subtitleLanguage,
          backgroundMusicUrl,
        },
      });

      if (response.data.generationId) {
        startVideoPolling(response.data.generationId);
      } else {
        setVideoError("영상 생성 요청 실패: generationId를 받지 못했습니다.");
        setIsVideoLoading(false);
      }
    } catch (err) {
      console.error("AI 영상 생성 요청 오류:", err);
      setVideoError(
        "AI 영상 생성 요청 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message)
      );
      setIsVideoLoading(false);
    }
  };

  return {
    videoImageId,
    setVideoImageId,
    videoPrompt,
    setVideoPrompt,
    isVideoLoading,
    videoError,
    transitionType,
    setTransitionType,
    transitionDuration,
    setTransitionDuration,
    textOverlayContent,
    setTextOverlayContent,
    textOverlayPosition,
    setTextOverlayPosition,
    enableSubtitles,
    setEnableSubtitles,
    subtitleLanguage,
    setSubtitleLanguage,
    backgroundMusicUrl,
    setBackgroundMusicUrl,
    handleGenerateVideo,
    startVideoPolling,
  };
};
