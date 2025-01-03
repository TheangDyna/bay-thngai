import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/api/auth.api";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const getMeQuery = useGetMeQuery();

  if (getMeQuery.isPending) return <div>Loading...</div>;

  if (getMeQuery.isError || !getMeQuery.data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
