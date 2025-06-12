import React, { useState, useRef } from "react";

const TemplateCard = ({ category, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && category.previewType === "video") {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && category.previewType === "video") {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // 영상 처음으로 되감기
    }
  };

  return (
    <div
      className="flex flex-col items-center p-4 border rounded-lg bg-white hover:shadow-lg cursor-pointer transition"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {category.previewUrl ? (
        <div className="w-24 h-24 mb-3 flex items-center justify-center overflow-hidden rounded">
          {category.previewType === "video" ? (
            <video
              ref={videoRef}
              src={category.previewUrl}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={category.previewUrl}
              alt={category.label}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded mb-3 flex items-center justify-center text-3xl text-gray-400">
          🖼️
        </div>
      )}
      <div className="font-semibold text-lg mb-1 text-center whitespace-pre-line">
        {category.label}
      </div>
      {/* 설명이나 추가 정보가 필요하다면 여기에 추가 */}
    </div>
  );
};

export default TemplateCard;
