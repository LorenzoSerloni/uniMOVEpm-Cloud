import { useContext } from "react";
import { AuthContext } from "./Contexts/SettingAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { idToken } = useContext(AuthContext);
  if (!idToken) return <Navigate to="/error" />;
  return <>{children}</>;
}