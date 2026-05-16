import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { useEffect, useRef } from "react"

export default function NotFound() {
    const navigate    = useNavigate()
    const contentRef  = useRef(null)

    useEffect(() => {
        if (!contentRef.current) return
        gsap.fromTo(
            [...contentRef.current.children],
            { opacity: 0, y: 28, filter: "blur(4px)" },
            { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.75, stagger: 0.12, ease: "power3.out" }
        )
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#060810" }}>

            {/* Fondo radial */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(109,40,217,0.09) 0%, transparent 70%)"
            }} />

            {/* Grain */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                opacity: 0.5, mixBlendMode: "overlay"
            }} />

            <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-5 text-center">

                {/* 404 con glow */}
                <div className="relative">
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
                        filter: "blur(24px)", transform: "scale(1.5)"
                    }} />
                    <p
                        className="font-black leading-none select-none relative"
                        style={{
                            fontSize: "clamp(6rem, 22vw, 11rem)",
                            background: "linear-gradient(135deg, rgba(124,58,237,0.55) 0%, rgba(168,85,247,0.25) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            letterSpacing: "-0.04em"
                        }}
                    >
                        404
                    </p>
                </div>

                {/* Divisor */}
                <div className="w-10 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(to right, #6d28d9, #9333ea)" }} />

                {/* Texto */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
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
                        background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                        boxShadow: "0 0 28px rgba(109,40,217,0.45)"
                    }}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}
