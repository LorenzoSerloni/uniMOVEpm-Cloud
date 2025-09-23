import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Contexts/UseAuth";


interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};