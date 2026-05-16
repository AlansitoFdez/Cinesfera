import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Search, User, UserCircle, Settings, LogOut, X, Sparkles } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { useAuth } from "../../hooks/useAuth";
import { useDevMode } from "../../hooks/useDevMode";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const NAV_CARDS_USER = [
  { label: "Películas", description: "Descubre los últimos estrenos y clásicos del cine.", bgColor: "#0d0d12", to: "/movies" },
  { label: "Series", description: "Sigue tus series favoritas, temporada a temporada.", bgColor: "#0f0e15", to: "/series" },
  { label: "Mis Listas", description: "Todo lo que quieres ver, en un solo lugar.", bgColor: "#100e16", to: "/list" },
];

const NAV_CARDS_ADMIN = [
  { label: "Usuarios", description: "Gestiona cuentas, roles y permisos de la plataforma.", bgColor: "#0d0d12", to: "/admin/users" },
  { label: "Reseñas", description: "Modera el contenido generado por los usuarios.", bgColor: "#0f0e15", to: "/admin/reviews" },
  { label: "Próximamente", description: "Nuevas herramientas de administración en camino.", bgColor: "#100e16", to: null },
];

// ─── MODAL DE BÚSQUEDA ────────────────────────────────────────────────────────
function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
      gsap.fromTo(modalRef.current, { opacity: 0, y: -16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power3.out" });
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.15, ease: "power2.in" });
    gsap.to(modalRef.current, { opacity: 0, y: -10, scale: 0.97, duration: 0.15, ease: "power2.in", onComplete: () => { setQuery(""); onClose(); } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?query=${query}`);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh]"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={modalRef}
        className="w-[90%] max-w-[640px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(6,8,16,0.98)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 0 60px rgba(109,40,217,0.2), 0 20px 60px rgba(0,0,0,0.9)" }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
          <Search size={18} style={{ color: "rgba(168,85,247,0.7)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas y series..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: "white", fontSize: "1rem", letterSpacing: "0.01em" }}
          />
          <button
            onClick={handleClose}
            className="p-1 rounded-full transition-all duration-200"
            style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}
          >
            <X size={16} />
          </button>
        </div>

        {!query && (
          <div className="px-5 py-4">
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#4b5563", marginBottom: "0.75rem" }}>Búsquedas populares</p>
            <div className="flex flex-wrap gap-2">
              {["Vengadores", "Batman", "Harry Potter", "Star Wars", "El Señor de los Anillos", "Marvel"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { navigate(`/search?query=${tag}`); handleClose(); }}
                  className="rounded-full transition-all duration-200"
                  style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem", color: "#9ca3af", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.15)", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)"; }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div className="px-5 py-4">
            <p style={{ fontSize: "0.75rem", color: "#4b5563" }}>Buscando <span style={{ color: "#a855f7" }}>"{query}"</span>...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NAVBAR PRINCIPAL ─────────────────────────────────────────────────────────
export default function Navbar() {
  const { user, logout } = useAuth();
  const { devMode, toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  // Modo admin activo cuando devMode es true
  const isAdmin = devMode;

  const USER_CARDS = [
    { label: "Mi Perfil", description: "Ve tu perfil tal y como lo ven los demás.", bgColor: "#0f0e15", to: `/profile/${user?.username}`, icon: User, isLogout: false },
    { label: "Social", description: "Comparte lo que ves y descubre qué ven los demás.", bgColor: "#0d0d12", to: "/social", icon: UserCircle, isLogout: false },
    { label: "Cerrar Sesión", description: "Hasta la próxima.", bgColor: "#120d0d", to: null, icon: LogOut, isLogout: true },
  ];

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleToggleDevMode = () => {
    toggleDevMode();
    navigate(isAdmin ? "/home" : "/admin");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cards del menú hamburguesa según modo
  const navCards = isAdmin ? NAV_CARDS_ADMIN : NAV_CARDS_USER;
  const activeCards = activeMenu === "user" ? USER_CARDS : navCards;

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 220;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const prev = { visibility: contentEl.style.visibility, pointerEvents: contentEl.style.pointerEvents, position: contentEl.style.position, height: contentEl.style.height };
        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";
        contentEl.offsetHeight;
        const total = 60 + contentEl.scrollHeight + 16;
        Object.assign(contentEl.style, prev);
        return total;
      }
    }
    return 220;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;
    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 40, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease: "power3.out" });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.07 }, "-=0.1");
    return tl;
  };

  useLayoutEffect(() => {
    gsap.set(navRef.current, { height: 60, overflow: "hidden" });
    return () => { tlRef.current?.kill(); };
  }, []);

  useEffect(() => {
    if (activeMenu === null) return;
    const id = setTimeout(() => {
      const tl = createTimeline();
      if (tl) { tlRef.current = tl; tl.play(0); }
    }, 20);
    return () => clearTimeout(id);
  }, [activeMenu]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        gsap.set(navRef.current, { height: calculateHeight() });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) { newTl.progress(1); tlRef.current = newTl; }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenuType = (type) => {
    const tl = tlRef.current;
    if (activeMenu === type) {
      setIsHamburgerOpen(false);
      if (tl) {
        tl.eventCallback("onReverseComplete", () => { setIsExpanded(false); setActiveMenu(null); });
        tl.reverse();
      }
    } else if (activeMenu !== null) {
      if (tl) {
        tl.eventCallback("onReverseComplete", () => { setActiveMenu(type); setIsHamburgerOpen(type === "nav"); });
        tl.reverse();
      }
    } else {
      setActiveMenu(type);
      setIsHamburgerOpen(type === "nav");
      setIsExpanded(true);
    }
  };

  const handleCardMouseEnter = (el, isLogout) => {
    gsap.to(el, { backgroundColor: isLogout ? "rgba(239,68,68,0.15)" : "rgba(124,58,237,0.2)", duration: 0.25, ease: "power2.out" });
  };

  const handleCardMouseLeave = (el, originalColor) => {
    gsap.to(el, { backgroundColor: originalColor, duration: 0.25, ease: "power2.out" });
  };

  const setCardRef = (i) => (el) => { if (el) cardsRef.current[i] = el; };

  if (!user || location.pathname === "/login") return null;

  return (
    <>
      {/* Modal de búsqueda — solo en modo usuario */}
      {!isAdmin && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}

      <div className="w-full flex justify-center py-4">
        <div className="relative w-[90%] max-w-[800px]">
          <nav
            ref={navRef}
            className="block h-[60px] p-0 rounded-xl relative overflow-hidden will-change-[height]"
            style={{
              background: isAdmin ? "rgba(6,8,16,0.97)" : scrolled ? "rgba(6,8,16,0.97)" : "transparent",
              border: isAdmin ? "1px solid rgba(124,58,237,0.32)" : "1px solid rgba(124,58,237,0.15)",
              boxShadow: isAdmin
                ? "0 0 40px rgba(124,58,237,0.15), 0 8px 32px rgba(0,0,0,0.6)"
                : "0 0 40px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.6)"
            }}
          >
            {/* ── Barra superior ── */}
            <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-4 z-[2]">

              {/* Izquierda: hamburguesa + logo (logo visible en móvil, oculto en desktop) */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="group flex flex-col justify-center gap-[6px] cursor-pointer h-full shrink-0"
                  onClick={() => toggleMenuType("nav")}
                  role="button"
                  aria-label={activeMenu === "nav" ? "Cerrar menú" : "Abrir menú"}
                  tabIndex={0}
                >
                  <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""}`} />
                  <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
                </div>

                {/* Logo en móvil — junto a la hamburguesa */}
                <div className="flex md:hidden items-center gap-2">
                  <span
                    onClick={() => navigate(isAdmin ? "/admin" : "/home")}
                    className="cursor-pointer"
                    style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.18em", color: "white" }}
                  >
                    Cin<span style={{ color: "#a855f7" }}>esfera</span>
                  </span>
                  {isAdmin && (
                    <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a855f7", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "9999px", padding: "0.15rem 0.5rem", background: "rgba(124,58,237,0.1)" }}>
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Logo en desktop — centrado absoluto */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
                <span
                  onClick={() => navigate(isAdmin ? "/admin" : "/home")}
                  className="cursor-pointer"
                  style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.22em", color: "white" }}
                >
                  Cin<span style={{ color: "#a855f7" }}>esfera</span>
                </span>
                {isAdmin && (
                  <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a855f7", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "9999px", padding: "0.15rem 0.5rem", background: "rgba(124,58,237,0.1)" }}>
                    Admin
                  </span>
                )}
              </div>

              {/* Acciones derecha */}
              {/* Recomendaciones IA — solo usuario */}
              <div className="flex items-center gap-1">
                {!isAdmin && (
                  <button
                    onClick={() => navigate("/recommendations")}
                    className="p-2 rounded-full transition-all duration-200"
                    style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}
                    title="Recomendaciones para ti"
                  >
                    <Sparkles size={15} />
                  </button>
                )}
                {/* Búsqueda — solo usuario */}
                {!isAdmin && (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full transition-all duration-200"
                    style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(168,85,247,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <Search size={15} />
                  </button>
                )}

                {/* Botón usuario */}
                <button
                  onClick={() => toggleMenuType("user")}
                  className="p-2 rounded-full transition-all duration-200"
                  style={{ border: "none", cursor: "pointer", color: activeMenu === "user" ? "white" : "#6b7280", background: activeMenu === "user" ? "rgba(168,85,247,0.08)" : "transparent" }}
                >
                  <User size={15} />
                </button>

                {/* Switch DEV — solo si tiene rol ADMIN */}
                {user.role === "ADMIN" && !isAdmin && (
                  <div className="flex items-center gap-1.5 ml-1">
                    <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#4b5563" }}>Dev</span>
                    <button
                      onClick={handleToggleDevMode}
                      className="relative rounded-full transition-all duration-300"
                      style={{ width: "36px", height: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.2)", cursor: "pointer" }}
                    >
                      <div className="absolute rounded-full bg-white" style={{ width: "14px", height: "14px", top: "2px", left: "2px" }} />
                    </button>
                  </div>
                )}

                {/* Botón salir — solo en modo admin */}
                {isAdmin && (
                  <button
                    onClick={handleToggleDevMode}
                    className="rounded-full transition-all duration-200"
                    style={{ padding: "0.4rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "white", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)", boxShadow: "0 0 16px rgba(109,40,217,0.45)", marginLeft: "4px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(109,40,217,0.65)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(109,40,217,0.45)"; }}
                  >
                    ← Salir
                  </button>
                )}
              </div>
            </div>

            {/* ── Cards expandibles ── */}
            <div
              className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex gap-2 flex-col md:flex-row md:items-stretch ${isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
              aria-hidden={!isExpanded}
            >
              {activeCards.map((card, idx) => {
                const Icon = card.icon;
                const isPlaceholder = card.to === null && !card.isLogout;
                return (
                  <div
                    key={card.label}
                    ref={setCardRef(idx)}
                    className="relative flex flex-col p-3 rounded-[calc(0.75rem-0.2rem)] flex-1"
                    style={{
                      backgroundColor: card.bgColor,
                      border: card.isLogout
                        ? "1px solid rgba(239,68,68,0.15)"
                        : isPlaceholder
                          ? "1px dashed rgba(168,85,247,0.15)"
                          : "1px solid rgba(168,85,247,0.2)",
                      minHeight: "60px",
                      cursor: isPlaceholder ? "default" : "pointer",
                      opacity: isPlaceholder ? 0.6 : 1
                    }}
                    onClick={() => {
                      if (isPlaceholder) return;
                      if (card.isLogout) { handleLogout(); }
                      else { navigate(card.to); toggleMenuType(activeMenu); }
                    }}
                    onMouseEnter={(e) => { if (!isPlaceholder) handleCardMouseEnter(e.currentTarget, card.isLogout); }}
                    onMouseLeave={(e) => { if (!isPlaceholder) handleCardMouseLeave(e.currentTarget, card.bgColor); }}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={15} style={{ color: card.isLogout ? "rgba(239,68,68,0.6)" : "rgba(168,85,247,0.6)" }} />}
                      <span className="font-semibold text-white" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", letterSpacing: "0.02em" }}>{card.label}</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: "1.4", marginTop: "0.35rem" }}>{card.description}</span>
                    {!isPlaceholder && (
                      <GoArrowUpRight className="self-end mt-auto" style={{ color: card.isLogout ? "rgba(239,68,68,0.4)" : "rgba(168,85,247,0.5)", fontSize: "1.2rem" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
