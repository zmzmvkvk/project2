import { useQuery } from "@tanstack/react-query";
import { fetchGeneratedImages } from "../api/assetApi";

export const useImages = (projectId) => {
  // ProductionRoom에서는 projectId를 기반으로 이미지를 필터링할 필요가 있습니다.
  // 현재 fetchGeneratedImages는 category만 지원하므로,
  // projectId에 따라 이미지를 필터링하려면 백엔드 API 수정 또는 프론트엔드에서 추가 필터링이 필요합니다.
  // 여기서는 일단 모든 이미지를 가져온 후, 필요하다면 프로젝트 ID로 필터링하는 로직을 추가할 수 있도록 준비합니다.
  // ProductionRoom에서 projectId를 넘겨받지만, fetchGeneratedImages가 projectId를 직접 받지 않으므로
  // 현재는 category를 'all'로 설정하여 모든 이미지를 가져오거나,
  // 향후 백엔드 API가 projectId 기반 조회를 지원하도록 개선되어야 합니다.
  // 우선은 모든 이미지를 가져오는 것으로 진행하고, 필요하다면 클라이언트 측에서 필터링합니다.

  return useQuery({
    queryKey: ["images", projectId], // projectId를 쿼리 키에 포함하여 프로젝트별 캐싱을 가능하게 합니다.
    queryFn: () => fetchGeneratedImages("all"), // 현재는 모든 이미지를 가져옵니다.
    enabled: !!projectId, // projectId가 유효할 때만 쿼리를 실행합니다.
  });
};
