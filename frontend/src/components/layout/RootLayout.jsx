import { Outlet } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import NavbarAdmin from "./NavbarAdmin";
import { useAuth } from "../../context/AuthContext";
import { useDevMode } from "../../context/DevModeContext";

export default function RootLayout() {
  const { user } = useAuth();
  const { devMode } = useDevMode();

  // Si el usuario es ADMIN y el modo dev está ON → navbar de admin
  // En cualquier otro caso → navbar de usuario normal
  const isAdminMode = user?.role === "ADMIN" && devMode;
  // El "?" después de user se llama optional chaining. Significa:
  // "si user existe, accede a .role; si user es null, devuelve undefined"
  // sin esto, si user es null, user.role lanzaría un error.

  return (
    <>
      {isAdminMode ? <NavbarAdmin /> : <NavbarUser />}
      <Outlet />
    </>
  );
}