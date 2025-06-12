import React from "react";
import ImageGrid from "../../asset/components/ImageGrid"; // ImageGrid는 asset/components에 있습니다.

const AssetPreviewPanel = ({ images, isImagesLoading, imagesError }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">내 애셋</h2>
      {isImagesLoading ? (
        <div className="text-gray-500">애셋을 불러오는 중...</div>
      ) : imagesError ? (
        <div className="text-red-500">
          애셋을 불러오는 중 오류 발생: {imagesError.message}
        </div>
      ) : images && images.length > 0 ? (
        <ImageGrid images={images} />
      ) : (
        <div className="text-gray-500">생성된 애셋이 없습니다.</div>
      )}
    </div>
  );
};

export default AssetPreviewPanel;
