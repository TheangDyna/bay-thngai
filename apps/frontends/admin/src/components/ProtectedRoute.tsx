import { useGetMeQuery } from "@/api/auth";
import Loading from "@/pages/Loading";
import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = "admin"
}) => {
  const { data, isPending, isError } = useGetMeQuery();
  const location = useLocation();

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data?.data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = data.data.role;
  if (userRole !== requiredRole) {
    console.log("Showing toast and redirecting to /unauthorized:", {
      userRole,
      requiredRole
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
