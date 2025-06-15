import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./SettingAuth";
import { useLocation, useNavigate } from "react-router-dom";

const COGNITO_LOGIN_URL = import.meta.env.VITE_COGNITO_LOGIN_URL as string;

function getIdTokenFromUrl(): string | null {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get("id_token");
}

function redirectToLogin() {
  window.location.href = COGNITO_LOGIN_URL;
}

// Helper to decode JWT and get exp
function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check token expiry and logout if expired
  useEffect(() => {
    let token = getIdTokenFromUrl();
    if (token) {
      localStorage.setItem("id_token", token);
      setIdToken(token);
      window.location.hash = "";
      if (location.pathname !== "/") {
        navigate("/");
      }
      setLoading(false);
    } else {
      token = localStorage.getItem("id_token");
      if (token) {
        const exp = getTokenExpiration(token);
        if (exp && Date.now() > exp) {
          localStorage.removeItem("id_token");
          redirectToLogin();
          return;
        }
        setIdToken(token);
        setLoading(false);

        // Set timeout to auto-logout when token expires
        if (exp) {
          const timeout = exp - Date.now();
          if (timeout > 0) {
            setTimeout(() => {
              localStorage.removeItem("id_token");
              redirectToLogin();
            }, timeout);
          } else {
            localStorage.removeItem("id_token");
            redirectToLogin();
          }
        }
      } else {
        redirectToLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      idToken,
      logout: () => {
        localStorage.removeItem("id_token");
        redirectToLogin();
      },
    }),
    [idToken]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
