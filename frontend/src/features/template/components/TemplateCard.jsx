const TemplateCard = ({ category, onClick }) => {
  return (
    <div
      className="flex flex-col items-center p-4 border rounded-lg bg-white hover:shadow-lg cursor-pointer transition"
      onClick={onClick}
    >
      {/* 임시 썸네일 */}
      <div className="w-24 h-24 bg-gray-200 rounded mb-3 flex items-center justify-center text-3xl text-gray-400">
        🖼️
      </div>
      <div className="font-semibold text-lg mb-1 text-center whitespace-pre-line">
        {category.label}
      </div>
      {/* 설명이나 추가 정보가 필요하다면 여기에 추가 */}
    </div>
  );
};

export default TemplateCard;
