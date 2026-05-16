import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { Sparkles, RefreshCw } from "lucide-react"
import useRecommendations from "../../hooks/useRecommendations"

// ─── TARJETA DE RECOMENDACIÓN ─────────────────────────────────────────────────
function RecommendationCard({ rec, index }) {
    const navigate = useNavigate()

    return (
        <div
            className="flex gap-4 sm:gap-5 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.08)"
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"
                e.currentTarget.style.background = "rgba(124,58,237,0.06)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)"
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            }}
            onClick={() => navigate(`/details/${rec.media_type}/${rec.tmdb_id}`)}
        >
            {/* Póster con número */}
            <div className="relative shrink-0" style={{ width: "72px", aspectRatio: "2/3" }}>
                {rec.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w185${rec.poster_path}`}
                        alt={rec.title}
                        className="w-full h-full object-cover rounded-lg"
                        style={{ border: "1px solid rgba(168,85,247,0.12)" }}
                    />
                ) : (
                    <div
                        className="w-full h-full rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.15)" }}
                    >
                        <span style={{ fontSize: "1.5rem", opacity: 0.4 }}>🎬</span>
                    </div>
                )}
                {/* Número */}
                <div
                    className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                >
                    {index + 1}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2 justify-center min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-base leading-tight">{rec.title}</h3>
                    <span
                        className="text-[10px] rounded-full px-2.5 py-0.5 font-semibold shrink-0"
                        style={rec.media_type === "movie"
                            ? { background: "rgba(124,58,237,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }
                            : { background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }
                        }
                    >
                        {rec.media_type === "movie" ? "Película" : "Serie"}
                    </span>
                </div>

                {/* Razón en cursiva con barra accent */}
                {rec.reason && (
                    <div className="flex gap-2.5 items-start">
                        <div className="w-[2px] h-full min-h-[2rem] rounded-full shrink-0 mt-0.5"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, transparent)" }} />
                        <p className="text-xs sm:text-sm italic leading-relaxed" style={{ color: "#6b7280" }}>
                            {rec.reason}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Recommendations() {
    const { recommendations, loading, error, hasLoaded, getRecommendations } = useRecommendations()
    const listRef = useRef(null)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    // Stagger al aparecer las recomendaciones
    useEffect(() => {
        if (!hasLoaded || !listRef.current) return
        const cards = [...listRef.current.children]
        gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
        )
    }, [hasLoaded, recommendations])

    return (
        <div className="min-h-screen pb-24 pt-28" style={{ background: "#0d1117" }}>
            {/* Fondo radial */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 10%, rgba(124,58,237,0.07) 0%, transparent 70%)"
            }} />

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-8 flex flex-col gap-10">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Para ti</h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                        Recomendaciones personalizadas basadas en tus valoraciones y favoritos
                    </p>
                </div>

                {/* Estado: sin generar aún */}
                {!hasLoaded && !loading && !error && (
                    <div className="flex flex-col items-center gap-6 py-10">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
                                <Sparkles size={28} style={{ color: "#a855f7" }} />
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "#6b7280", maxWidth: "30ch" }}>
                                Analizamos tus reseñas y favoritos para encontrar lo que más te va a gustar
                            </p>
                        </div>
                        <button
                            onClick={getRecommendations}
                            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                boxShadow: "0 0 32px rgba(124,58,237,0.4)"
                            }}
                        >
                            <Sparkles size={16} />
                            Generar recomendaciones
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center gap-5 py-20">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
                            <div className="absolute inset-0 rounded-full"
                                style={{ boxShadow: "0 0 20px rgba(124,58,237,0.4)" }} />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-sm font-medium text-white">Analizando tus gustos</p>
                            <p className="text-xs" style={{ color: "#4b5563" }}>Esto puede tardar unos segundos</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-xl px-5 py-4 flex flex-col gap-3"
                        style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                        <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                        <button
                            onClick={getRecommendations}
                            className="text-sm font-semibold w-fit transition-colors duration-150"
                            style={{ color: "#a855f7" }}
                        >
                            Intentar de nuevo →
                        </button>
                    </div>
                )}

                {/* Lista de recomendaciones */}
                {hasLoaded && recommendations.length > 0 && (
                    <>
                        <div ref={listRef} className="flex flex-col gap-3">
                            {recommendations.map((rec, i) => (
                                <RecommendationCard key={`${rec.tmdb_id}-${i}`} rec={rec} index={i} />
                            ))}
                        </div>

                        {/* Regenerar */}
                        <button
                            onClick={getRecommendations}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                                background: "rgba(124,58,237,0.08)",
                                border: "1px solid rgba(168,85,247,0.18)",
                                color: "#a855f7"
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.18)"}
                        >
                            <RefreshCw size={14} />
                            Regenerar recomendaciones
                        </button>
                    </>
                )}

                {/* Sin resultados */}
                {hasLoaded && recommendations.length === 0 && !loading && (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <span style={{ fontSize: "2.5rem", opacity: 0.2 }}>🎬</span>
                        <p className="text-sm text-center" style={{ color: "#4b5563" }}>
                            No pudimos generar recomendaciones.<br />Añade más reseñas o favoritos e inténtalo de nuevo.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
