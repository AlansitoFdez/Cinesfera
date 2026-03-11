import { Outlet } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import NavbarAdmin from "./NavbarAdmin";
import { useAuth } from "../../context/UseAuth";
import { useDevMode } from "../../context/UseDevMode";

export default function RootLayout() {
  const { user } = useAuth();
  const { devMode } = useDevMode();

  const isAdminMode = user?.role === "ADMIN" && devMode;

  return (
    // relative es obligatorio para que el navbar absolute
    // se posicione relativo a este contenedor y no a la ventana
    <div className="relative">
      {/* absolute hace que el navbar flote encima del contenido
          sin empujarlo hacia abajo
          left-0 right-0 → ocupa todo el ancho
          z-50 → flota por encima de todo el contenido de la página */}
      <div className="absolute top-0 left-0 right-0 z-50">
        {isAdminMode ? <NavbarAdmin /> : <NavbarUser />}
      </div>

      {/* El contenido empieza desde top: 0, el navbar flota encima */}
      <Outlet />
    </div>
  );
}