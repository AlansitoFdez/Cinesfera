import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDevMode } from "../../context/DevModeContext";

export default function NavbarAdmin() {
  const { user, logout } = useAuth();
  const { toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Al desactivar el modo dev, apagamos el switch Y redirigimos al home
  const handleDeactivateDevMode = () => {
    toggleDevMode();
    navigate("/home");
  };

  if (!user || location.pathname === "/login") return null;

  return (
    <div className="w-full flex justify-center py-4">
      {/* Borde morado más intenso para distinguirlo visualmente del navbar normal */}
      <nav className="inline-flex items-center gap-2 bg-[#0f0f14] rounded-full px-4 py-2 border border-purple-500/40">
        {/* ── LOGO con etiqueta ADMIN ────────────────────────────────────────
            Añadimos una pequeña etiqueta junto al logo para dejar
            claro que estamos en modo administración                      */}
        <Link to="/admin" className="pr-4 flex items-center gap-2 no-underline">
          <span className="text-xl font-black tracking-widest uppercase text-white">
            Cine<span className="text-purple-500">sfera</span>
          </span>
          {/* Etiqueta pequeña que identifica el modo actual */}
          <span className="text-[9px] uppercase tracking-widest text-purple-400 border border-purple-500/40 rounded-full px-2 py-0.5">
            Admin
          </span>
        </Link>

        {/* ── DIVISOR ── */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── LINKS DE ADMINISTRACIÓN ──
            En morado para distinguirlos visualmente de los links normales */}
        <div className="flex items-center gap-1">
          {[
            { label: "Usuarios", to: "/admin/users" },
            // Aquí irás añadiendo más links según los vayas necesitando
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-full text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── DIVISOR ── */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── ACCIONES ── */}
        <div className="flex items-center gap-2 pl-2">
          {/* Botón salir del modo admin
              bg-purple-500/10      → fondo morado muy sutil
              hover:bg-purple-500/20 → se intensifica al hover
              border-purple-500/30  → borde morado semitransparente  */}
          <button
            onClick={handleDeactivateDevMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors cursor-pointer"
          >
            {/* Flecha izquierda para reforzar que es una acción de "volver" */}
            ← Salir del modo admin
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>
      </nav>
    </div>
  );
}
