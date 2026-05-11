import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Lock, Globe, Trash2 } from "lucide-react";
import { useListDetail } from "../../hooks/useLists";

// ─── TARJETA DE CONTENIDO ─────────────────────────────────────────────────────
function ContentCard({ item, isOwner, onRemove }) {
    const navigate = useNavigate();

    return (
        <div
            className="flex gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.1)"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.1)"}
            onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
        >
            {/* Póster */}
            <img
                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                alt={item.title}
                className="rounded-xl shrink-0 object-cover"
                style={{ width: "52px", height: "78px" }}
            />

            {/* Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                <span className="text-white font-semibold text-sm truncate">{item.title}</span>
                <div className="flex items-center gap-3">
                    <span
                        className="text-xs uppercase tracking-widest rounded-full px-2 py-0.5"
                        style={{
                            background: item.media_type === "movie"
                                ? "rgba(124,58,237,0.15)"
                                : "rgba(59,130,246,0.15)",
                            color: item.media_type === "movie" ? "#a855f7" : "#60a5fa",
                            border: `1px solid ${item.media_type === "movie" ? "rgba(168,85,247,0.2)" : "rgba(96,165,250,0.2)"}`
                        }}
                    >
                        {item.media_type === "movie" ? "Película" : "Serie"}
                    </span>
                    {item.vote_average > 0 && (
                        <span className="text-xs" style={{ color: "#fbbf24" }}>
                            ⭐ {item.vote_average?.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>

            {/* Botón eliminar — solo si eres el dueño */}
            {isOwner && (
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onRemove(item.tmdb_id, item.media_type);
                    }}
                    className="shrink-0 p-2 rounded-lg self-center transition-colors duration-150"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}
                    title="Quitar de la lista"
                >
                    <Trash2 size={15} />
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

    useEffect(() => { window.scrollTo(0, 0) }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando lista...</p>
        </div>
    );

    if (error || !list) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Lista no encontrada o privada.</p>
        </div>
    );

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-10">

                {/* Botón volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest w-fit"
                    style={{ color: "#6b7280" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                >
                    <ArrowLeft size={15} />
                    Volver
                </button>

                {/* Header de la lista */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1
                            className="text-3xl font-black text-white uppercase tracking-widest"
                            style={{ fontFamily: "'Georgia', serif" }}
                        >
                            {list.name}
                        </h1>
                        {list.is_default && (
                            <span className="text-xs rounded-full px-3 py-1"
                                style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                                Por defecto
                            </span>
                        )}
                    </div>

                    {list.description && (
                        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{list.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs uppercase tracking-widest" style={{ color: "#4b5563" }}>
                        <span>{list.items.length} {list.items.length === 1 ? "título" : "títulos"}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1.5">
                            {list.is_public
                                ? <Globe size={12} />
                                : <Lock size={12} />
                            }
                            <span>{list.is_public ? "Pública" : "Privada"}</span>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: "rgba(168,85,247,0.15)" }} />

                {/* Contenido de la lista */}
                {list.items.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <p className="text-4xl">🎬</p>
                        <p className="uppercase tracking-widest text-sm text-center" style={{ color: "#6b7280" }}>
                            Esta lista está vacía
                        </p>
                        {list.is_owner && (
                            <p className="text-xs text-center" style={{ color: "#4b5563" }}>
                                Añade contenido desde la página de detalle de cualquier película o serie
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
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