import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDevMode } from "../../context/DevModeContext";

export default function NavbarUser() {
  const { user, logout } = useAuth();
  const { toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Al activar el modo dev, encendemos el switch Y redirigimos al admin
  const handleActivateDevMode = () => {
    toggleDevMode();
    navigate("/admin");
  };

  if (!user || location.pathname === "/login") return null;

  return (
    <div className="w-full flex justify-center py-4">
      <nav className="inline-flex items-center gap-2 bg-[#0f0f14] rounded-full px-4 py-2 border border-purple-900/40">
        {/* ── LOGO ── */}
        <Link
          to="/home"
          className="pr-4 text-xl font-black tracking-widest uppercase text-white no-underline"
        >
          Cine<span className="text-purple-500">sfera</span>
        </Link>

        {/* ── DIVISOR ── */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── LINKS ──
            Mismo patrón de antes: un array de objetos que mapeamos
            para no repetir el mismo JSX cinco veces                */}
        <div className="flex items-center gap-1">
          {[
            { label: "Películas", to: "/movies" },
            { label: "Series", to: "/series" },
            { label: "Mi Lista", to: "/list" },
            { label: "Amigos", to: "/friends" },
            { label: "Configuración", to: "/settings" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── DIVISOR ── */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── ICONOS + SWITCH ADMIN ── */}
        <div className="flex items-center gap-1 pl-2">
          {/* Buscador */}
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            <Search size={16} />
          </button>

          {/* Perfil / logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <User size={16} />
          </button>

          {/* ── SWITCH DEV (solo si el usuario es ADMIN) ──────────────────
              Solo el admin ve el switch. Si no es admin, este bloque
              no se renderiza y el navbar se ve exactamente igual
              para todos los usuarios normales                          */}
          {user.role === "ADMIN" && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Dev
              </span>
              {/* Al hacer click activa el modo dev Y redirige al admin */}
              <button
                onClick={handleActivateDevMode}
                className="relative w-9 h-5 rounded-full transition-colors duration-300 cursor-pointer border-0"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {/* Círculo siempre a la izquierda porque aquí el modo dev está OFF */}
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
