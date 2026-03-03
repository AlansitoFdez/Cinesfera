import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <h1 style={{ color: "red" }}>Home USER</h1>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <h1 style={{ color: "red" }}>Home ADMIN</h1>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
