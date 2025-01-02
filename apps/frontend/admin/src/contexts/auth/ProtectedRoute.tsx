import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
