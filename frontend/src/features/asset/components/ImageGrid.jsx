import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteImage } from "../api/assetApi";

const ImageGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
  });

  const handleDelete = async (imageId) => {
    if (window.confirm("이 이미지를 삭제하시겠습니까?")) {
      await deleteMutation.mutateAsync(imageId);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images?.map((image) => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-lg overflow-hidden"
          >
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-full object-cover"
              onClick={() => setSelectedImage(image)}
            />

            {/* 이미지 위에 호버 시 표시되는 액션 버튼들 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleDelete(image.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 상세 보기 모달 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full mx-4">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">프롬프트</h3>
              <p className="text-gray-600">{selectedImage.prompt}</p>
              {selectedImage.negativePrompt && (
                <>
                  <h3 className="font-semibold mt-2">네거티브 프롬프트</h3>
                  <p className="text-gray-600">
                    {selectedImage.negativePrompt}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
