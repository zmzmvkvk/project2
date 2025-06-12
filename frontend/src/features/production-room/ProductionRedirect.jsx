import { useParams, Navigate } from "react-router-dom";

const ProductionRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}/production`} replace />;
};

export default ProductionRedirect;
