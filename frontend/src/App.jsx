import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DevModeProvider } from "./context/DevModeContext";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <DevModeProvider>
        <RouterProvider router={router} />
      </DevModeProvider>
    </AuthProvider>
  );
}

export default App;