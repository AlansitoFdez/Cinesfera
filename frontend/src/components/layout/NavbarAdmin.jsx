import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { User, UserCircle, Settings, LogOut } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { useAuth } from "../../hooks/UseAuth";
import { useDevMode } from "../../hooks/UseDevMode";

const ADMIN_CARDS = [
  { label: "Usuarios", description: "Gestiona cuentas, roles y permisos de la plataforma.", bgColor: "#0d0d12", to: "/admin/users" },
  { label: "Próximamente", description: "Nuevas herramientas de administración en camino.", bgColor: "#0f0e15", to: null },
];

const USER_CARDS = [
  { label: "Amigos", description: "Comparte lo que ves y descubre qué ven los demás.", bgColor: "#0d0d12", to: "/friends", icon: UserCircle, isLogout: false },
  { label: "Configuración", description: "Gestiona tu perfil, tus datos y tu privacidad.", bgColor: "#0f0e15", to: "/settings", icon: Settings, isLogout: false },
  { label: "Cerrar Sesión", description: "Hasta la próxima.", bgColor: "#120d0d", to: null, icon: LogOut, isLogout: true },
];

export default function NavbarAdmin() {
  const { user, logout } = useAuth();
  const { toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleDeactivateDevMode = () => { toggleDevMode(); navigate("/home"); };

  const activeCards = activeMenu === "user" ? USER_CARDS : ADMIN_CARDS;

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
        tl.eventCallback("onReverseComplete", () => {
          setIsExpanded(false);
          setActiveMenu(null);
        });
        tl.reverse();
      }
    } else if (activeMenu !== null) {
      if (tl) {
        tl.eventCallback("onReverseComplete", () => {
          setActiveMenu(type);
          setIsHamburgerOpen(type === "nav");
        });
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
    <div className="w-full flex justify-center py-4">
      <div className="relative w-[90%] max-w-[800px]">
        <nav
          ref={navRef}
          className="block h-[60px] p-0 rounded-xl relative overflow-hidden will-change-[height]"
          style={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 40px rgba(124,58,237,0.15), 0 8px 32px rgba(0,0,0,0.6)" }}
        >
          <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-4 z-[2]">

            <div
              className="group flex flex-col justify-center gap-[6px] cursor-pointer order-2 md:order-none h-full"
              onClick={() => toggleMenuType("nav")}
              role="button"
              aria-label={activeMenu === "nav" ? "Cerrar menú" : "Abrir menú"}
              tabIndex={0}
            >
              <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""}`} />
              <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </div>

            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none flex items-center gap-2">
              <span onClick={() => navigate("/admin")} className="cursor-pointer" style={{ fontFamily: "'Georgia', serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "white" }}>
                Cin<span style={{ color: "#a855f7" }}>esfera</span>
              </span>
              <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "9999px", padding: "0.15rem 0.5rem", background: "rgba(124,58,237,0.1)" }}>
                Admin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDeactivateDevMode}
                className="rounded-full transition-all duration-200"
                style={{ padding: "0.4rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "white", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", boxShadow: "0 4px 15px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.6), 0 0 0 1px rgba(168,85,247,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 15px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.2)"; }}
              >
                ← Salir
              </button>

              <button
                onClick={() => toggleMenuType("user")}
                className="p-2 rounded-full transition-all duration-200"
                style={{ border: "none", cursor: "pointer", color: activeMenu === "user" ? "white" : "#6b7280", background: activeMenu === "user" ? "rgba(168,85,247,0.08)" : "transparent" }}
              >
                <User size={15} />
              </button>
            </div>
          </div>

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
                  style={{ backgroundColor: card.bgColor, border: card.isLogout ? "1px solid rgba(239,68,68,0.15)" : isPlaceholder ? "1px dashed rgba(168,85,247,0.15)" : "1px solid rgba(168,85,247,0.2)", minHeight: "60px", cursor: isPlaceholder ? "default" : "pointer", opacity: isPlaceholder ? 0.6 : 1 }}
                  onClick={() => { if (isPlaceholder) return; if (card.isLogout) { handleLogout(); } else { navigate(card.to); toggleMenuType(activeMenu); } }}
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
  );
}