import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Lock, Globe, Trash2 } from "lucide-react";
import { useListDetail } from "../../hooks/useLists";

// ─── TARJETA DE CONTENIDO ─────────────────────────────────────────────────────
function ContentCard({ item, isOwner, onRemove }) {
    const navigate = useNavigate();

    return (
        <div
            className="flex gap-4 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.08)"
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.28)";
                e.currentTarget.style.background = "rgba(124,58,237,0.05)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
        >
            {/* Póster */}
            <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: "48px", aspectRatio: "2/3" }}>
                <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                <span className="text-white font-semibold text-sm truncate">{item.title}</span>
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className="text-[10px] rounded-full px-2 py-0.5 font-medium"
                        style={{
                            background: item.media_type === "movie"
                                ? "rgba(124,58,237,0.12)"
                                : "rgba(59,130,246,0.12)",
                            color: item.media_type === "movie" ? "#a855f7" : "#60a5fa",
                            border: `1px solid ${item.media_type === "movie"
                                ? "rgba(168,85,247,0.2)"
                                : "rgba(96,165,250,0.2)"}`
                        }}
                    >
                        {item.media_type === "movie" ? "Película" : "Serie"}
                    </span>
                    {item.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                            <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                            <span className="text-xs font-medium" style={{ color: "#9ca3af" }}>
                                {item.vote_average?.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón eliminar */}
            {isOwner && (
                <button
                    onClick={e => { e.stopPropagation(); onRemove(item.tmdb_id, item.media_type); }}
                    className="shrink-0 p-2 rounded-lg self-center transition-colors duration-150"
                    style={{ color: "#374151" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                    title="Quitar de la lista"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function ListDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { list, loading, error, removeItem } = useListDetail(parseInt(id));

    useEffect(() => { window.scrollTo(0, 0); }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
            <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
            <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
        </div>
    );

    if (error || !list) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Lista no encontrada o privada.</p>
        </div>
    );

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                {/* Botón volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm w-fit transition-colors duration-200"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}
                >
                    <ArrowLeft size={14} />
                    Volver
                </button>

                {/* Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            {list.name}
                        </h1>
                        {list.is_default && (
                            <span className="text-[10px] rounded-full px-2.5 py-1 font-semibold"
                                style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                                Favoritos
                            </span>
                        )}
                    </div>

                    {list.description && (
                        <p className="pl-6 text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                            {list.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 pl-6 text-xs" style={{ color: "#4b5563" }}>
                        <span>{list.items.length} {list.items.length === 1 ? "título" : "títulos"}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1.5">
                            {list.is_public
                                ? <Globe size={11} />
                                : <Lock size={11} />
                            }
                            <span>{list.is_public ? "Pública" : "Privada"}</span>
                        </div>
                    </div>
                </div>

                {/* Divisor */}
                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.12) 30%, rgba(168,85,247,0.12) 70%, transparent)" }} />

                {/* Contenido */}
                {list.items.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <span style={{ fontSize: "2.5rem", opacity: 0.2 }}>🎬</span>
                        <p className="text-sm text-center" style={{ color: "#4b5563" }}>
                            Esta lista está vacía
                        </p>
                        {list.is_owner && (
                            <p className="text-xs text-center" style={{ color: "#374151" }}>
                                Añade contenido desde la página de detalle de cualquier película o serie
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {list.items.map(item => (
                            <ContentCard
                                key={`${item.tmdb_id}-${item.media_type}`}
                                item={item}
                                isOwner={list.is_owner}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
