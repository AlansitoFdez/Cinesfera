import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Search, User } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import { useAuth } from "../../context/AuthContext";
import { useDevMode } from "../../context/DevModeContext";

const NAV_CARDS = [
  {
    label: "Películas",
    description: "Descubre los últimos estrenos y clásicos del cine.",
    bgColor: "#0d0d12",
    to: "/movies",
  },
  {
    label: "Series",
    description: "Sigue tus series favoritas, temporada a temporada.",
    bgColor: "#0f0e15",
    to: "/series",
  },
  {
    label: "Mi Lista",
    description: "Todo lo que quieres ver, en un solo lugar.",
    bgColor: "#100e16",
    to: "/list",
  },
  {
    label: "Amigos",
    description: "Comparte lo que ves y descubre qué ven los demás.",
    bgColor: "#0e0d13",
    to: "/friends",
  },
];

export default function NavbarUser() {
  const { user, logout } = useAuth();
  const { toggleDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleActivateDevMode = () => {
    toggleDevMode();
    navigate("/admin");
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 220;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const prev = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        };
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
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.07 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => { tl?.kill(); tlRef.current = null; };
  }, []);

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

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const handleCardMouseEnter = (el) => {
    gsap.to(el, { backgroundColor: "rgba(124,58,237,0.2)", duration: 0.25, ease: "power2.out" });
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
          style={{
            background: "rgba(15,15,20,0.95)",
            border: "1px solid rgba(168,85,247,0.15)",
            boxShadow: "0 0 40px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {/* ── BARRA SUPERIOR ── */}
          <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-4 z-[2]">

            {/* Hamburger */}
            <div
              className="group flex flex-col justify-center gap-[6px] cursor-pointer order-2 md:order-none h-full"
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
              tabIndex={0}
            >
              <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""}`} />
              <div className={`w-[22px] h-[2px] bg-gray-400 transition-all duration-300 origin-center group-hover:bg-white ${isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </div>

            {/* Logo */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
              <span
                onClick={() => navigate("/home")}
                className="cursor-pointer"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                Cine<span style={{ color: "#a855f7" }}>sfera</span>
              </span>
            </div>

            {/* Iconos derecha */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-full transition-all duration-200"
                style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(168,85,247,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}
              >
                <Search size={15} />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full transition-all duration-200"
                style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(168,85,247,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; }}
              >
                <User size={15} />
              </button>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-1.5 ml-1">
                  <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#4b5563" }}>
                    Dev
                  </span>
                  <button
                    onClick={handleActivateDevMode}
                    className="relative rounded-full transition-all duration-300"
                    style={{ width: "36px", height: "20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.2)", cursor: "pointer" }}
                  >
                    <div className="absolute rounded-full bg-white" style={{ width: "14px", height: "14px", top: "2px", left: "2px" }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── CARDS ── */}
          <div
            className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex gap-2 flex-col md:flex-row md:items-stretch ${isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
            aria-hidden={!isExpanded}
          >
            {NAV_CARDS.map((card, idx) => (
              <div
                key={card.to}
                ref={setCardRef(idx)}
                className="relative flex flex-col p-3 rounded-[calc(0.75rem-0.2rem)] flex-1 cursor-pointer"
                style={{
                  backgroundColor: card.bgColor,
                  border: "1px solid rgba(168,85,247,0.1)",
                  minHeight: "60px",
                }}
                onClick={() => { navigate(card.to); toggleMenu(); }}
                onMouseEnter={(e) => handleCardMouseEnter(e.currentTarget)}
                onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget, card.bgColor)}
              >
                {/* Título */}
                <span
                  className="font-semibold text-white"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)", letterSpacing: "0.02em" }}
                >
                  {card.label}
                </span>

                {/* Descripción */}
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    lineHeight: "1.4",
                    marginTop: "0.35rem",
                  }}
                >
                  {card.description}
                </span>

                {/* Flecha — mt-auto la empuja siempre al fondo sin importar el texto */}
                <GoArrowUpRight
                  className="self-end mt-auto"
                  style={{ color: "rgba(168,85,247,0.5)", fontSize: "1.2rem" }}
                />
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}