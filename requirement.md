AI Shorts Automation Program: System Requirements (JS Ver.)
Version: 1.1
Last Updated: 2025-06-11

#project-overview (프로젝트 개요)
이 프로젝트는 전문 크리에이터를 위한 개인용 AI 쇼츠 영상 자동화 제작 프로그램을 개발하는 것을 목표로 합니다. 사용자의 아이디어를 기반으로 텍스트, 이미지를 입력받아 전문가 수준의 영상 및 이미지 콘텐츠를 생성하는 강력하고 직관적인 데스크톱 애플리케이션입니다.

주요 기능:

AI 기반 이미지 및 영상 생성 (Txt2Img, Img2Img, Img2Vid)
LoRA 모델 학습 및 관리
템플릿 기반의 간편한 쇼츠 제작
캐릭터 및 프롬프트 관리
핵심 기술 스택:

Frontend: React, Vite, JavaScript(JSX)
Backend: Node.js, Express
Desktop App: Electron.js
Styling: Tailwind CSS
State Management: Zustand, React Query (TanStack Query)
API Communication: Axios
#feature-requirements (기능 요구사항)
프로젝트에 필요한 구체적인 기능 목록입니다. 각 기능은 역할과 구현 기술을 함께 명시합니다.

1. 프로젝트 관리
[R-1.1] 프로젝트 생성, 조회, 삭제
역할: 사용자가 작업 내용을 프로젝트 단위로 관리할 수 있도록 CRUD 기능을 제공합니다.
기술 구현: React 컴포넌트로 UI를 구성하고, Axios를 통해 백엔드 API (/api/projects)를 호출합니다. 서버 데이터는 React Query로 관리하여 UI에 표시합니다.
2. 템플릿 시스템
[R-2.1] 템플릿 갤러리 및 미리보기
역할: 사전 정의된 쇼츠 템플릿 목록을 시각적으로 탐색하고, 선택 시 제작실로 설정을 전달합니다.
기술 구현: 템플릿 데이터(JSON)를 백엔드에서 제공하고, 프론트엔드에서는 갤러리 레이아웃으로 렌더링합니다. 마우스 호버 시 GIF/Video 미리보기가 재생되도록 구현합니다.
3. 제작실 (Production Room)
[R-3.1] 텍스트/이미지 기반 AI 콘텐츠 생성
역할: 프로그램의 핵심 기능으로, 사용자가 프롬프트와 이미지를 입력하여 원하는 결과물을 생성하는 작업 공간입니다.
기술 구현: 3단 레이아웃 UI를 React로 구현합니다. 우측 '인스펙터'에서 사용자 입력을 받아 Axios로 백엔드의 AI 생성 API (/api/generate/image)를 호출합니다. 생성 진행 상태는 폴링(Polling) 방식으로 주기적으로 확인하며, 로딩 상태는 Zustand로 관리합니다.
4. 설정
[R-4.1] LoRA 모델 학습 및 관리
역할: 사용자가 자신만의 이미지 스타일(LoRA)을 학습시키고 관리하는 고급 기능입니다.
기술 구현: 이미지 업로드를 위한 Form을 React로 구현하고, 백엔드에 전송합니다. 백엔드는 학습 프로세스를 백그라운드에서 실행하고, 프론트엔드는 학습 상태 API를 주기적으로 호출하여 진행률을 표시합니다.
[R-4.2] API 키 및 프롬프트 관리
역할: 외부 API 키와 자주 사용하는 프롬프트를 저장하고 관리하여 작업 효율을 높입니다.
기술 구현: 간단한 CRUD 인터페이스를 React로 구현하고, 입력된 데이터는 백엔드 API를 통해 안전하게 서버에 저장합니다.
#relevant-codes (관련 코드)
프로젝트의 외부 라이브러리 연동에 필요한 실제 사용 가능한 코드 예시입니다.

1. Leonardo AI 이미지 생성 요청 (Backend)
axios를 사용하여 백엔드(Node.js)에서 Leonardo AI API를 호출하는 실제 코드입니다.

JavaScript

// backend/src/services/leonardoService.js

import axios from 'axios';

const API_KEY = process.env.LEONARDO_API_KEY;
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

// 이미지 생성을 요청하는 함수
async function generateImage(prompt, isPublic = false, modelId = '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3') {
  try {
    const generationResponse = await axios.post(
      `${BASE_URL}/generations`,
      {
        prompt: prompt,
        modelId: modelId,
        public: isPublic,
        sd_version: "v2", // 예시 파라미터
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Bearer ${API_KEY}`
        }
      }
    );
    // 생성 작업의 ID를 반환
    return generationResponse.data.sdGenerationJob.generationId;
  } catch (error) {
    console.error("Error calling Leonardo API for generation:", error.response?.data);
    throw new Error("Failed to start image generation.");
  }
}

// 생성된 이미지의 URL을 가져오는 함수
async function getGeneratedImage(generationId) {
  let attempts = 0;
  while (attempts < 20) { // 최대 20번 시도 (약 1분)
    try {
      const response = await axios.get(
        `${BASE_URL}/generations/${generationId}`,
        {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${API_KEY}`
          }
        }
      );

      const generationData = response.data.generations_by_pk;
      if (generationData && generationData.status === 'COMPLETE') {
        return generationData.generated_images[0].url;
      }
      // 아직 생성 중이면 3초 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    } catch (error) {
      console.error("Error fetching generated image:", error.response?.data);
      throw new Error("Failed to fetch generated image.");
    }
  }
  throw new Error("Image generation timed out.");
}

export { generateImage, getGeneratedImage };
2. OpenAI 텍스트 생성 요청 (Backend)
openai 라이브러리를 사용하여 스토리 프롬프트를 생성하는 실제 코드입니다.

JavaScript

// backend/src/services/openaiService.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 주어진 키워드로 쇼츠 스토리 아이디어를 생성하는 함수
async function generateStoryPrompt(keywords) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // 또는 "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "You are a creative writer who creates short, engaging story ideas for YouTube shorts based on keywords."
        },
        {
          role: "user",
          content: `Create a short story plot with a surprising twist using these keywords: ${keywords.join(', ')}`
        }
      ],
      max_tokens: 200,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate story prompt.");
  }
}

export { generateStoryPrompt };
#current-file-instruction (현재 파일 구조)
프로젝트의 파일 구조는 모듈화와 유지보수성을 극대화하기 위해 아래와 같이 구성합니다. 이 구조는 커서가 올바른 위치에 파일을 생성하고, 코드의 역할을 명확히 하는 데 도움을 줍니다.

Bash

ai-shorts-creator/
├── desktop/             # Electron 메인 프로세스 관련 파일
├── backend/              # Node.js 백엔드 서버
│   └── src/
│       ├── api/             # API 라우트 정의 (e.g., projectRoutes.js)
│       ├── controllers/     # 요청/응답 처리 로직
│       ├── services/        # 비즈니스 로직, 외부 API 연동 (e.g., leonardoService.js)
│       ├── middleware/      # 에러 핸들링 미들웨어 등
│       └── app.js           # Express 서버 초기화 및 실행
├── frontend/             # React 프론트엔드
│   └── src/
│       ├── components/      # 공용 재사용 컴포넌트 (e.g., Button.jsx, Modal.jsx)
│       ├── features/        # 기능 단위 폴더 (페이지와 유사)
│       │   └── production-room/
│       │       ├── components/ # 해당 기능에서만 사용하는 컴포넌트
│       │       ├── hooks/      # 해당 기능에서만 사용하는 커스텀 훅
│       │       └── ProductionRoom.jsx # 기능의 메인 컴포넌트
│       ├── hooks/           # 전역 커스텀 훅
│       ├── lib/             # Axios 인스턴스 등 외부 라이브러리 설정
│       ├── store/           # Zustand 전역 상태 스토어
│       └── main.jsx         # React 앱 진입점
└── package.json             # 프로젝트 전체 의존성 관리
#rules (규칙)
프로젝트의 일관성과 코드 품질 유지를 위해 모든 개발 작업은 아래 규칙을 반드시 준수해야 합니다.

Backend-for-Frontend (BFF) 원칙: 프론트엔드는 외부 AI API(Leonardo, OpenAI 등)를 직접 호출하지 않는다. 모든 외부 API 연동은 반드시 백엔드를 통해 이루어져야 한다. 이는 API 키를 안전하게 보호하고 로직을 중앙에서 관리하기 위함이다.

상태 관리 분리 원칙:

React Query: 서버로부터 받아오는 모든 데이터(프로젝트 목록, 템플릿 등)는 React Query로 관리한다. 서버 상태를 클라이언트 상태와 혼합하지 않는다.
Zustand: 순수 UI 상태(모달 열림/닫힘, 탭 선택 등)에만 사용한다.
상수 및 설정 관리: 모든 API 키, URL, 고정 문자열 등은 코드에 하드코딩하지 않는다. 백엔드에서는 .env 파일을, 프론트엔드에서는 src/constants 폴더를 통해 관리한다.

컴포넌트 위치 규칙:

여러 기능(페이지)에서 공통으로 사용될 컴포넌트(예: Button, Input)는 frontend/src/components/ 에 생성한다.
특정 기능(페이지)에서만 사용되는 컴포넌트(예: 제작실의 Canvas)는 해당 기능 폴더 내부의 components 폴더(예: frontend/src/features/production-room/components/)에 생성한다.
파일 및 함수 네이밍 규칙:

컴포넌트 파일: PascalCase를 사용한다. (예: PrimaryButton.jsx)
일반 JS 파일/함수: camelCase를 사용한다. (예: apiClient.js, fetchProjects())
훅(Hook) 파일/함수: use 접두사를 붙인 camelCase를 사용한다. (예: useDebounce.js)