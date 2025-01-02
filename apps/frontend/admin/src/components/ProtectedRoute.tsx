import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "@/api/auth.api";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data, isPending, isError } = useGetMeQuery();

  if (isPending) return <div>Loading...</div>;

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
