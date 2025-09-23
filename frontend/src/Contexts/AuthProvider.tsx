import { useMemo, type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./SettingAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  useMemo(() => {
    const coockies = getCookie("auth");
    console.log(coockies)
    const user = coockies ? "auth" : null;
    setUser(user)
  }, []);

  // call this function when you want to authenticate the user
  const login = useMemo(
    () => async (data: string) => {
      toast.success("Login sucessfull", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setUser(data);
      navigate("/");
    },
    [navigate, setUser]
  );

  const value = useMemo(
    () => ({
      user,
      login,
    }),
    [login, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
