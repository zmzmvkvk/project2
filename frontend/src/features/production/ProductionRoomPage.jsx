import { Outlet } from "react-router-dom";

const ProductionRoomPage = () => {
  return (
    <div>
      {/* <h2>제작실 메인 페이지</h2> */}
      <Outlet />
    </div>
  );
};

export default ProductionRoomPage;
