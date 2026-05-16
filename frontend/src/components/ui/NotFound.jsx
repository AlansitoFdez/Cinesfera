import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { useEffect, useRef } from "react"

export default function NotFound() {
    const navigate = useNavigate()
    const contentRef = useRef(null)

    useEffect(() => {
        if (!contentRef.current) return
        gsap.fromTo(
            [...contentRef.current.children],
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }
        )
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0d1117" }}>
            {/* Fondo radial */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)"
            }} />

            <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-5 text-center">
                {/* Número */}
                <p
                    className="font-bold leading-none select-none"
                    style={{
                        fontSize: "clamp(6rem, 20vw, 10rem)",
                        background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.15) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}
                >
                    404
                </p>

                {/* Divisor */}
                <div className="w-12 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(to right, #7c3aed, #a855f7)" }} />

                {/* Texto */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        Página no encontrada
                    </h1>
                    <p className="text-sm" style={{ color: "#4b5563" }}>
                        Esta ruta no existe en Cinesfera
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={() => navigate("/home")}
                    className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                    style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                        boxShadow: "0 0 24px rgba(124,58,237,0.4)"
                    }}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}
