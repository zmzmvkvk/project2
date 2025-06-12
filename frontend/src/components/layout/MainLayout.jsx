import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";

const MAIN_TABS = [
  { label: "대시보드", path: "/" },
  { label: "프로젝트", path: "/projects" },
  { label: "템플릿", path: "/templates" },
  { label: "에셋", path: "/assets" },
  { label: "제작실", path: "/production" },
  { label: "설정", path: "/settings" },
];

const SUB_TABS = {
  "/projects": [
    { label: "프로젝트 목록", path: "/projects" },
    { label: "프로젝트 추가", path: "/projects/new" },
  ],
  "/templates": [
    { label: "쇼츠 템플릿 목록", path: "/templates" },
    { label: "TEST", path: "/templates/test" },
    { label: "에셋", path: "/templates/assets" },
    { label: "새 템플릿", path: "/templates/new" },
  ],
  "/assets": [{ label: "에셋 관리", path: "/assets" }],
  "/production": [
    // 제작실은 주로 /projects/:id/production 경로를 통해 접근하며 ProductionRoom 컴포넌트가 내부 UI를 관리합니다.
    // 여기서는 최상위 /production 탭의 세부 탭들을 제거합니다.
  ],
  "/settings": [
    { label: "API 키 관리", path: "/settings/api-key" },
    { label: "LoRA 관리", path: "/settings/lora" },
    { label: "프롬프트 관리", path: "/settings/prompts" },
    // 'AI 모델 설정', '캐릭터 목록', '캐릭터 상세'는 사용자 요청에 따라 제거합니다.
  ],
};

function getMainTab(pathname) {
  if (pathname === "/") return "/";
  for (const tab of MAIN_TABS) {
    if (pathname.startsWith(tab.path) && tab.path !== "/") return tab.path;
  }
  return "/";
}

function isSubTabActive(subPath, pathname) {
  if (subPath === "/") return pathname === "/";
  if (pathname === subPath) return true;
  if (
    subPath === "/projects" &&
    pathname.startsWith("/projects") &&
    !pathname.startsWith("/projects/new")
  )
    return true;
  if (subPath === "/projects/new" && pathname === "/projects/new") return true;
  if (subPath === "/templates" && pathname.startsWith("/templates"))
    return true;
  if (subPath === "/assets" && pathname.startsWith("/assets")) return true;
  // 기존 production 관련 조건 제거 (위 SUB_TABS에서 이미 제거됨)
  // settings 관련 조건은 그대로 유지하되, SUB_TABS에 정의된 경로에 대해서만 동작하도록 합니다.
  if (subPath.startsWith("/settings") && pathname.startsWith(subPath))
    return true;
  return false;
}

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainTab = getMainTab(location.pathname);
  const subTabs = SUB_TABS[mainTab] || [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 탑바 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                AI Shorts Creator
              </h1>
            </div>
            <nav className="flex space-x-2">
              {MAIN_TABS.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`px-4 py-2 rounded-t-md font-medium focus:outline-none ${
                    mainTab === tab.path
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* 서브탭 */}
        {subTabs.length > 0 && (
          <div className="bg-gray-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-2 py-2">
                {subTabs.map((sub) => (
                  <button
                    key={sub.path}
                    onClick={() => navigate(sub.path)}
                    className={`px-3 py-1 rounded font-medium focus:outline-none ${
                      isSubTabActive(sub.path, location.pathname)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
