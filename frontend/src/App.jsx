import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <h1 style={{ color: "red" }}>Home USER</h1>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="ADMIN">
        <h1 style={{ color: "red" }}>Home ADMIN</h1>
      </ProtectedRoute>
    )
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App