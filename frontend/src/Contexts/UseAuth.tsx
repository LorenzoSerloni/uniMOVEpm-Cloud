import { useContext } from "react";
import { AuthContext } from "../Contexts/SettingAuth";

interface AuthContextType {
    user: string | null;
    login: (data: string) => Promise<void>;
  }

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};