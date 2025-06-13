import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "tailwindcss";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./Contexts/ContextProvider.tsx";
import { AuthProvider } from "./Contexts/AuthProvider";
import Router from "./Router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Router />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
