import { createContext } from "react";

export const AuthContext = createContext<{
  user: string | null;
  login: (data: string) => Promise<void>;
}>({
  user: null,
  login: async () => {},
});