import { Routes, Route } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import Visualization from "./Visualization";

export default function Router() {
  return (
    <Routes>
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
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}
