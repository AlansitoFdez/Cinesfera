import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useRecommendations from "../../hooks/useRecommendations"

// ─── TARJETA DE RECOMENDACIÓN ─────────────────────────────────────────────────
function RecommendationCard({ rec }) {
    const navigate = useNavigate()

    return (
        <div
            className="flex gap-5 rounded-2xl p-5 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.1)"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.1)"}
            onClick={() => navigate(`/details/${rec.media_type}/${rec.tmdb_id}`)}
        >
            {/* Póster */}
            {rec.poster_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w185${rec.poster_path}`}
                    alt={rec.title}
                    className="rounded-xl shrink-0 object-cover"
                    style={{ width: "80px", height: "120px" }}
                />
            ) : (
                <div
                    className="rounded-xl shrink-0 flex items-center justify-center"
                    style={{
                        width: "80px",
                        height: "120px",
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(168,85,247,0.2)"
                    }}
                >
                    <span style={{ fontSize: "2rem" }}>🎬</span>
                </div>
            )}

            {/* Info */}
            <div className="flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-bold text-lg">{rec.title}</h3>
                    <span
                        className="text-xs rounded-full px-3 py-1 font-semibold uppercase tracking-widest"
                        style={rec.media_type === "movie"
                            ? { background: "rgba(124,58,237,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }
                            : { background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }
                        }
                    >
                        {rec.media_type === "movie" ? "Película" : "Serie"}
                    </span>
                </div>
                <p className="text-sm" style={{ color: "#9ca3af", lineHeight: "1.6" }}>
                    {rec.reason}
                </p>
            </div>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Recommendations() {
    const { recommendations, loading, error, hasLoaded, getRecommendations } = useRecommendations()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <h1
                            className="text-3xl font-black text-white uppercase tracking-widest shrink-0"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            Para <span style={{ color: "#a855f7" }}>ti</span>
                        </h1>
                        <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.15)" }} />
                    </div>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                        Recomendaciones personalizadas basadas en tus valoraciones y favoritos
                    </p>
                </div>

                {/* Botón generar */}
                {!hasLoaded && !loading && (
                    <button
                        onClick={getRecommendations}
                        className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-white transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                            boxShadow: "0 8px 25px rgba(124,58,237,0.4)"
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 35px rgba(124,58,237,0.6)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,58,237,0.4)"}
                    >
                        ✨ Generar recomendaciones
                    </button>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <div
                            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: "rgba(168,85,247,0.3)", borderTopColor: "#a855f7" }}
                        />
                        <p className="text-sm uppercase tracking-widest" style={{ color: "#6b7280" }}>
                            Analizando tus gustos...
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div
                        className="rounded-2xl px-6 py-5 flex flex-col gap-3"
                        style={{
                            background: "rgba(239,68,68,0.07)",
                            border: "1px solid rgba(239,68,68,0.2)"
                        }}
                    >
                        <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
                        <button
                            onClick={getRecommendations}
                            className="text-sm font-semibold uppercase tracking-widest w-fit"
                            style={{ color: "#a855f7" }}
                        >
                            Intentar de nuevo →
                        </button>
                    </div>
                )}

                {/* Recomendaciones */}
                {hasLoaded && recommendations.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {recommendations.map((rec, i) => (
                            <RecommendationCard key={`${rec.tmdb_id}-${i}`} rec={rec} />
                        ))}

                        {/* Botón regenerar */}
                        <button
                            onClick={getRecommendations}
                            className="mt-4 py-3 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all duration-200"
                            style={{
                                background: "rgba(124,58,237,0.1)",
                                border: "1px solid rgba(168,85,247,0.2)",
                                color: "#a855f7"
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)"}
                        >
                            ✨ Regenerar recomendaciones
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}