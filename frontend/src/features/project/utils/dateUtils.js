import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale";

export const formatDate = (dateString) => {
  if (!dateString) return "날짜 정보 없음";

  const date = new Date(dateString);
  if (!isValid(date)) return "날짜 정보 없음";

  try {
    return format(date, "yyyy년 MM월 dd일", { locale: ko });
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 정보 없음";
  }
};
