import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export default function Footer() {
    const navigate = useNavigate()

    return (
        // Contenedor principal del footer
        // py-10 → padding vertical para que respire
        // px-8 → padding horizontal
        // mt-8 → separación respecto al último carrusel
        <footer
            className="py-10 px-8 mt-8" // ligeramente más oscuro que el body (#0d1117)
        >
            {/* Separador superior con color púrpura sutil
                El Separator de Shadcn es simplemente un <hr> estilizado
                Le sobreescribimos el color con className */}
            <Separator
                className="mb-8"
                style={{ background: "rgba(168,85,247,0.2)" }}
            />

            {/* Logo centrado — mismo patrón que el navbar */}
            <div className="flex justify-center mb-6">
                <span
                    onClick={() => navigate("/home")}
                    className="cursor-pointer"
                    style={{
                        fontFamily: "'Georgia', serif",
                        fontWeight: 900,
                        fontSize: "1.4rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "white"
                    }}
                >
                    Cin<span style={{ color: "#a855f7" }}>esfera</span>
                </span>
            </div>

            {/* Links de navegación centrados
                flex justify-center → los centra horizontalmente
                gap-8 → espacio entre cada link */}
            <div className="flex justify-center gap-8 mb-6 flex-wrap">
                {[
                    { label: "Películas", ruta: "/movies" },
                    { label: "Series", ruta: "/series" },
                    { label: "Mis Listas", ruta: "/list" },
                    { label: "Configuración", ruta: "/settings" },
                ].map((link) => (
                    // Usamos .map() para no repetir el mismo JSX por cada link
                    // transition-colors duration-200 → transición suave en el hover
                    <span
                        key={link.label}
                        onClick={() => navigate(link.ruta)}
                        className="cursor-pointer transition-colors duration-200"
                        style={{ color: "#6b7280", fontSize: "0.85rem", letterSpacing: "0.05em" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}
                    >
                        {link.label}
                    </span>
                ))}
            </div>

            {/* Separador inferior */}
            <Separator
                className="mb-6"
                style={{ background: "rgba(168,85,247,0.1)" }}
            />

            {/* Copyright — centrado y en gris oscuro */}
            <p
                className="text-center"
                style={{ color: "#4b5563", fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
                © {new Date().getFullYear()} Cinesfera · Todos los derechos reservados
            </p>
            {/* new Date().getFullYear() → obtiene el año actual automáticamente
                Así no tienes que acordarte de cambiarlo cada año */}
        </footer>
    )
}