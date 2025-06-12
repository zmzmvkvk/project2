import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProjectListPage from "../features/project/ProjectListPage";
import ProjectDetailPage from "../features/project/ProjectDetailPage";
import ProjectNewPage from "../features/project/ProjectNewPage";
import TemplateListPage from "../features/template/TemplateListPage";
import TemplateDetailPage from "../features/template/TemplateDetailPage";
import TemplateNewPage from "../features/template/TemplateNewPage";
import AssetPage from "../features/asset/AssetPage";
import ProductionRoomPage from "../features/production/ProductionRoomPage";
import ProductionImageTextPage from "../features/production/ProductionImageTextPage";
import ProductionImageImg2ImgPage from "../features/production/ProductionImageImg2ImgPage";
import ProductionVideoTextPage from "../features/production/ProductionVideoTextPage";
import ProductionVideoImg2ImgPage from "../features/production/ProductionVideoImg2ImgPage";
import SettingsPage from "../features/settings/SettingsPage";
import LoraPage from "../features/settings/LoraPage";
import ApiKeyPage from "../features/settings/ApiKeyPage";
import AiModelPage from "../features/settings/AiModelPage";
import PromptsPage from "../features/settings/PromptsPage";
import CharactersPage from "../features/settings/CharactersPage";
import ProductionRoom from "../features/production-room/ProductionRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "projects",
        children: [
          { index: true, element: <ProjectListPage /> },
          { path: "new", element: <ProjectNewPage /> },
          { path: ":id", element: <ProjectDetailPage /> },
          { path: ":id/production", element: <ProductionRoom /> },
        ],
      },
      {
        path: "templates",
        children: [
          { path: "new", element: <TemplateNewPage /> },
          { index: true, element: <TemplateListPage /> },
          { path: ":id", element: <TemplateDetailPage /> },
          { path: "test", element: <div>TEST 템플릿 페이지</div> },
          { path: "assets", element: <div>템플릿 에셋 페이지</div> },
        ],
      },
      { path: "assets", element: <AssetPage /> },
      {
        path: "production",
        element: <ProductionRoomPage />,
        children: [
          { index: true, element: <Navigate to="image/text" replace /> },
          { path: "image/text", element: <ProductionImageTextPage /> },
          { path: "image/img2img", element: <ProductionImageImg2ImgPage /> },
          { path: "video/text", element: <ProductionVideoTextPage /> },
          { path: "video/img2img", element: <ProductionVideoImg2ImgPage /> },
        ],
      },
      {
        path: "settings",
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="api-key" replace /> },
          { path: "api-key", element: <ApiKeyPage /> },
          { path: "lora", element: <LoraPage /> },
          { path: "prompts", element: <PromptsPage /> },
          { path: "ai-model", element: <AiModelPage /> },
          { path: "characters", element: <CharactersPage /> },
          { path: "characters/:id", element: <div>캐릭터 상세</div> },
        ],
      },
    ],
  },
]);
