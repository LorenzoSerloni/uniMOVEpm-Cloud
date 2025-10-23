import { Routes, Route } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Visualization from "./VisualizationPage";
import LoginPage from "./LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualization/:date/:title"
        element={
          <ProtectedRoute>
            <Visualization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map/:date/:title"
        element={
          <ProtectedRoute>
            <Visualization />
          </ProtectedRoute>
        }
      />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}
