const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 템플릿 목록 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">최근 템플릿</h3>
            <p className="text-gray-500">템플릿 목록이 여기에 표시됩니다.</p>
          </div>
          
          {/* 생성된 콘텐츠 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">최근 생성된 콘텐츠</h3>
            <p className="text-gray-500">생성된 콘텐츠가 여기에 표시됩니다.</p>
          </div>
          
          {/* 빠른 액션 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">빠른 액션</h3>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                새 템플릿 만들기
              </button>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                콘텐츠 생성하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 