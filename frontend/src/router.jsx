import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PlaceholderPage from "./components/ui/PlaceHolderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },

      // ── RUTAS DE USUARIO ──────────────────────────────────────────────
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Home" />
          </ProtectedRoute>
        ),
      },
      {
        path: "movies",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Películas" />
          </ProtectedRoute>
        ),
      },
      {
        path: "series",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Series" />
          </ProtectedRoute>
        ),
      },
      {
        path: "list",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Mi Lista" />
          </ProtectedRoute>
        ),
      },
      {
        path: "friends",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Amigos" />
          </ProtectedRoute>
        ),
      },

      // ── RUTAS DE ADMIN ────────────────────────────────────────────────
      {
        path: "admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <PlaceholderPage title="Panel Admin" />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute role="ADMIN">
            <PlaceholderPage title="Usuarios" />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);