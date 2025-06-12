import React from "react";
import { Outlet } from "react-router-dom";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* 탭 컨텐츠 (Outlet을 통해 자식 라우트 렌더링) */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
