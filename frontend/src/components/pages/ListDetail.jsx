import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Lock, Globe, Trash2 } from "lucide-react";
import { useListDetail } from "../../hooks/useLists";

// ─── TARJETA DE CONTENIDO ─────────────────────────────────────────────────────
function ContentCard({ item, isOwner, onRemove }) {
    const navigate = useNavigate();

    return (
        <div
            className="flex gap-4 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)";
            }}
            onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
        >
            {/* Póster */}
            <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: "52px", aspectRatio: "2/3" }}>
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
                        className="text-[10px] rounded-full px-2 py-0.5 font-semibold"
                        style={{
                            background: item.media_type === "movie" ? "rgba(109,40,217,0.12)" : "rgba(59,130,246,0.1)",
                            color:      item.media_type === "movie" ? "#c084fc" : "#60a5fa",
                            border:     `1px solid ${item.media_type === "movie" ? "rgba(124,58,237,0.25)" : "rgba(96,165,250,0.2)"}`
                        }}
                    >
                        {item.media_type === "movie" ? "Película" : "Serie"}
                    </span>
                    {item.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                            <span style={{ color: "#eab308", fontSize: "10px" }}>★</span>
                            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
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
    const { id }       = useParams();
    const navigate     = useNavigate();
    const { list, loading, error, removeItem } = useListDetail(parseInt(id));

    const headerRef = useRef(null);
    const listRef   = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!headerRef.current || loading) return;
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 22, filter: "blur(4px)" },
            { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
        );
    }, [loading]);

    useEffect(() => {
        if (loading || !listRef.current) return;
        const cards = [...listRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out", delay: 0.2 }
        );
    }, [loading, list]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#060810" }}>
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(124,58,237,0.15)" }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
                <div className="absolute inset-2 rounded-full animate-spin" style={{ borderTop: "1.5px solid rgba(168,85,247,0.4)", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent", animationDuration: "1.5s", animationDirection: "reverse" }} />
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="uppercase tracking-[0.4em] text-[10px] font-semibold" style={{ color: "#6d28d9" }}>Cinesfera</p>
                <p className="uppercase tracking-[0.2em] text-[9px]" style={{ color: "#1f2937" }}>Cargando</p>
            </div>
        </div>
    );

    if (error || !list) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060810" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Lista no encontrada o privada.</p>
        </div>
    );

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#060810" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                {/* Volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-medium w-fit transition-colors duration-200"
                    style={{ color: "#374151" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                    onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                >
                    <ArrowLeft size={13} />
                    Volver
                </button>

                {/* Header */}
                <div ref={headerRef} className="flex flex-col gap-3 relative">
                    <div className="absolute -top-6 -left-4 w-48 h-48 pointer-events-none" style={{
                        background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)",
                        borderRadius: "50%"
                    }} />

                    <div className="flex items-center gap-3 flex-wrap relative z-10">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {list.name}
                        </h1>
                        {list.is_default && (
                            <span className="text-[9px] rounded-full px-2.5 py-1 font-bold uppercase tracking-wider"
                                style={{ background: "rgba(109,40,217,0.18)", color: "#c084fc", border: "1px solid rgba(124,58,237,0.28)" }}>
                                Favoritos
                            </span>
                        )}
                    </div>

                    {list.description && (
                        <p className="pl-6 text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                            {list.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 pl-6">
                        <span className="text-xs font-medium" style={{ color: "#374151" }}>
                            {list.items.length} {list.items.length === 1 ? "título" : "títulos"}
                        </span>
                        <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} />
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#374151" }}>
                            {list.is_public ? <Globe size={11} /> : <Lock size={11} />}
                            <span>{list.is_public ? "Pública" : "Privada"}</span>
                        </div>
                    </div>
                </div>

                {/* Divisor */}
                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.12) 30%, rgba(124,58,237,0.12) 70%, transparent)" }} />

                {/* Contenido */}
                {list.items.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                        <p className="text-sm text-center" style={{ color: "#374151" }}>
                            Esta lista está vacía
                        </p>
                        {list.is_owner && (
                            <p className="text-xs text-center" style={{ color: "#1f2937", maxWidth: "28ch" }}>
                                Añade contenido desde la página de detalle de cualquier película o serie
                            </p>
                        )}
                    </div>
                ) : (
                    <div ref={listRef} className="flex flex-col gap-2 sm:gap-3">
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
