import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDevMode } from "../../context/DevModeContext";

export default function Navbar() {

  // ─── HOOKS ────────────────────────────────────────────────────────────────
  const { user, logout } = useAuth();
  const { devMode, toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Si no hay usuario, no renderizamos nada (pantalla de login)
  if (!user || location.pathname === "/login") return null;

  return (
    // Contenedor exterior: ocupa todo el ancho y centra el navbar dentro
    // py-4 → padding vertical para que no esté pegado al borde superior
    <div className="w-full flex justify-center py-4">

      {/* ── NAVBAR (la píldora) ──────────────────────────────────────────────
          inline-flex  → se adapta al contenido en vez de ocupar todo el ancho
          items-center → centra verticalmente todos los hijos
          gap-2        → espacio pequeño entre secciones
          bg-[#0f0f14] → color de fondo oscuro (valor personalizado con [])
          rounded-full → bordes completamente redondeados, forma de píldora
          px-4 py-2    → padding horizontal y vertical interior
          border       → activa el borde
          border-purple-900/40 → color morado muy oscuro al 40% de opacidad  */}
      <nav className="inline-flex items-center gap-2 bg-[#0f0f14] rounded-full px-4 py-2 border border-purple-900/40">

        {/* ── LOGO ─────────────────────────────────────────────────────────── 
            pr-4 → padding derecho para separarlo del divisor
            text-xl font-black → texto grande y muy grueso
            tracking-widest → letras muy separadas entre sí
            uppercase → todo en mayúsculas                                    */}
        <Link to="/home" className="pr-4 text-xl font-black tracking-widest uppercase text-white no-underline">
          Cin<span className="text-purple-500">esfera</span>
        </Link>

        {/* ── DIVISOR IZQUIERDO ─────────────────────────────────────────────
            w-px     → ancho de 1 píxel (una línea finísima)
            h-5      → altura fija de 20px
            bg-white/10 → blanco al 10% de opacidad (gris muy sutil)         */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── LINKS DE NAVEGACIÓN ───────────────────────────────────────────
            flex     → los links se colocan en fila
            items-center → centrados verticalmente
            gap-1    → espacio mínimo entre links                             */}
        <div className="flex items-center gap-1">

          {/* Cada link tiene los mismos estilos base:
              px-3 py-1.5  → padding interior
              rounded-full → también redondeado para el efecto hover
              text-sm      → texto pequeño
              text-gray-300 → color gris claro
              hover:text-white → al pasar el ratón se vuelve blanco
              hover:bg-white/5 → fondo blanco muy sutil al hacer hover
              transition-colors → anima el cambio de color suavemente        */}
          {[
            { label: "Películas", to: "/movies" },
            { label: "Series",    to: "/series"  },
            { label: "Mi Lista",  to: "/list"    },
            { label: "Amigos",    to: "/friends" },
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

          {/* ── LINKS EXCLUSIVOS DEL ADMIN (solo si devMode está ON) ─────────
              Aparecen a continuación de los links normales
              text-purple-400 → morado para distinguirlos visualmente         */}
          {user.role === "ADMIN" && devMode && (
            <>
              {[
                { label: "Usuarios",      to: "/admin/users"  },
                { label: "Estadísticas",  to: "/admin/stats"  },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-3 py-1.5 rounded-full text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </>
          )}
        </div>

        {/* ── DIVISOR DERECHO ───────────────────────────────────────────────
            Idéntico al izquierdo                                             */}
        <div className="w-px h-5 bg-white/10" />

        {/* ── SECCIÓN DERECHA: iconos + switch admin ────────────────────────
            pl-2 → pequeño padding izquierdo para separarlo del divisor       */}
        <div className="flex items-center gap-1 pl-2">

          {/* Icono de búsqueda
              p-2          → padding para que el área clickable sea más grande
              rounded-full → redondeado para el hover
              text-gray-400 → color gris
              hover:text-white hover:bg-white/5 → mismos efectos que los links
              cursor-pointer → muestra la manita al pasar el ratón            */}
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            {/* Search es un icono de lucide-react, size controla el tamaño en px */}
            <Search size={16} />
          </button>

          {/* Icono de perfil / logout
              Al hacer click hace logout (puedes cambiar esto por un dropdown) */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <User size={16} />
          </button>

          {/* ── SWITCH DEV (solo admin) ───────────────────────────────────── 
              ml-1 → margen izquierdo para separarlo un poco del icono        */}
          {user.role === "ADMIN" && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Dev
              </span>

              {/* El switch es un button con posición relativa para el círculo interior */}
              <button
                onClick={toggleDevMode}
                className="relative w-9 h-5 rounded-full transition-colors duration-300 cursor-pointer border-0"
                style={{ background: devMode ? "#7c3aed" : "rgba(255,255,255,0.1)" }}
              >
                {/* Círculo deslizante
                    absolute  → se posiciona dentro del button
                    top-0.5   → separado 2px del borde superior
                    transition-all → anima el movimiento suavemente           */}
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                  style={{ left: devMode ? "18px" : "2px" }}
                />
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}