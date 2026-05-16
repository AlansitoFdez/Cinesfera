import { useNavigate } from "react-router-dom"

const LINKS = [
    { label: "Películas",     ruta: "/movies"   },
    { label: "Series",        ruta: "/series"   },
    { label: "Mis listas",    ruta: "/list"     },
    { label: "Configuración", ruta: "/settings" },
]

export default function Footer() {
    const navigate = useNavigate()

    return (
        <footer className="px-6 sm:px-8 pb-10 pt-2">
            {/* Separador superior degradado */}
            <div className="mb-8 h-px" style={{
                background: "linear-gradient(to right, transparent, rgba(168,85,247,0.18) 30%, rgba(168,85,247,0.18) 70%, transparent)"
            }} />

            {/* Logo */}
            <div className="flex justify-center mb-6">
                <span
                    onClick={() => navigate("/home")}
                    className="cursor-pointer font-bold transition-opacity duration-200 hover:opacity-80"
                    style={{ fontSize: "1.3rem", letterSpacing: "0.22em", color: "white" }}
                >
                    Cin<span style={{ color: "#a855f7" }}>esfera</span>
                </span>
            </div>

            {/* Links */}
            <div className="flex justify-center gap-6 sm:gap-8 mb-6 flex-wrap">
                {LINKS.map((link) => (
                    <span
                        key={link.label}
                        onClick={() => navigate(link.ruta)}
                        className="cursor-pointer text-sm transition-colors duration-200"
                        style={{ color: "#4b5563" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
                        onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}
                    >
                        {link.label}
                    </span>
                ))}
            </div>

            {/* Separador inferior */}
            <div className="mb-6 h-px" style={{
                background: "linear-gradient(to right, transparent, rgba(168,85,247,0.08) 30%, rgba(168,85,247,0.08) 70%, transparent)"
            }} />

            {/* Copyright */}
            <p className="text-center text-xs" style={{ color: "#374151" }}>
                © {new Date().getFullYear()} Cinesfera · Todos los derechos reservados
            </p>
        </footer>
    )
}
