import { createContext } from "react";

export const AuthContext = createContext<{
  idToken: string | null;
  logout: () => void;
}>({
  idToken: null,
  logout: () => {},
});