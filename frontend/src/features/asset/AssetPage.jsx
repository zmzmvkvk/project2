import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGeneratedImages } from "./api/assetApi";
import ImageGenerationForm from "./components/ImageGenerationForm";
import ImageGrid from "./components/ImageGrid";

const AssetPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["generatedImages", selectedCategory],
    queryFn: () => fetchGeneratedImages(selectedCategory),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI 자산 관리</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 이미지 생성 폼 */}
        <div className="lg:col-span-1">
          <ImageGenerationForm />
        </div>

        {/* 오른쪽: 생성된 이미지 그리드 */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div>로딩 중...</div>
          ) : isError ? (
            <div>이미지를 불러오는데 실패했습니다.</div>
          ) : (
            <ImageGrid images={images} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetPage;
