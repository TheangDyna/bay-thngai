import { ReactElement } from "react";
// import { Navigate } from "react-router-dom";
import Loading from "@/pages/Loading";
import { useGetMeQuery } from "@/api/auth.api";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const getMeQuery = useGetMeQuery();

  if (getMeQuery.isPending) return <Loading />;

  // if (getMeQuery.isError || !getMeQuery.data.data) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
