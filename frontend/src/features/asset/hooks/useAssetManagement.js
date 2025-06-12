import { useImages } from "./useImages";

export const useAssetManagement = (projectId) => {
  const {
    data: images,
    isLoading: isImagesLoading,
    error: imagesError,
    refetch: refetchImages,
  } = useImages(projectId);

  return {
    images,
    isImagesLoading,
    imagesError,
    refetchImages,
  };
};
