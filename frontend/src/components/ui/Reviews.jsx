import { useState } from "react";
import useReviews from "../../hooks/UseReviews";
import { useAuth } from "../../hooks/useAuth";
import { Pencil, Trash2 } from "lucide-react";

const RATING_LABELS = {
    1: "Terrible", 2: "Muy mala", 3: "Mala",   4: "Mediocre",
    5: "Regular",  6: "Aceptable", 7: "Buena", 8: "Muy buena",
    9: "Excelente", 10: "Obra maestra"
};

// ─── ESTRELLAS ────────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-0.5">
                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange && onChange(star)}
                        onMouseEnter={() => { if (!readonly) setHovered(star); }}
                        onMouseLeave={() => { if (!readonly) setHovered(0); }}
                        style={{
                            color:      star <= active ? "#eab308" : "#1f2937",
                            fontSize:   "1.1rem",
                            background: "none",
                            border:     "none",
                            cursor:     readonly ? "default" : "pointer",
                            padding:    "0 1px",
                            lineHeight: 1,
                            transform:  star <= active && !readonly ? "scale(1.15)" : "scale(1)",
                            transition: "transform 0.1s, color 0.1s"
                        }}
                    >
                        ★
                    </button>
                ))}
            </div>
            {active > 0 && !readonly && (
                <span className="text-xs font-semibold" style={{ color: "#a855f7" }}>
                    {active}/10 — {RATING_LABELS[active]}
                </span>
            )}
        </div>
    );
}

// ─── FORMULARIO ───────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit, initialData = null, onCancel }) {
    const [rating,  setRating]  = useState(initialData?.rating  || 0);
    const [comment, setComment] = useState(initialData?.comment || "");

    const handleSubmit = () => {
        if (!rating) return;
        onSubmit({ rating, comment });
    };

    return (
        <div
            className="rounded-xl p-4 sm:p-5 flex flex-col gap-4"
            style={{
                background: "rgba(255,255,255,0.025)",
                border:     "1px solid rgba(124,58,237,0.18)"
            }}
        >
            <p className="text-white font-semibold text-sm">
                {initialData ? "Editar tu reseña" : "¿Qué te pareció?"}
            </p>

            {/* Rating */}
            <div className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                    Valoración
                </span>
                <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Comentario */}
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Cuéntanos tu opinión... (opcional)"
                rows={3}
                style={{
                    background:  "rgba(255,255,255,0.03)",
                    border:      "1px solid rgba(255,255,255,0.07)",
                    borderRadius:"10px",
                    color:       "#d1d5db",
                    padding:     "10px 12px",
                    fontSize:    "0.9rem",
                    resize:      "none",
                    outline:     "none",
                    width:       "100%",
                    transition:  "border-color 0.2s, box-shadow 0.2s"
                }}
                onFocus={e => {
                    e.target.style.borderColor = "rgba(124,58,237,0.45)";
                    e.target.style.boxShadow   = "0 0 0 3px rgba(124,58,237,0.08)";
                }}
                onBlur={e => {
                    e.target.style.borderColor = "rgba(255,255,255,0.07)";
                    e.target.style.boxShadow   = "none";
                }}
            />

            {/* Botones */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={handleSubmit}
                    disabled={!rating}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                        background: rating ? "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)" : "rgba(109,40,217,0.12)",
                        boxShadow:  rating ? "0 0 20px rgba(109,40,217,0.35)" : "none",
                        color:      rating ? "#fff" : "#374151",
                        cursor:     rating ? "pointer" : "not-allowed"
                    }}
                >
                    {initialData ? "Guardar cambios" : "Publicar reseña"}
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
                        onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── TARJETA DE RESEÑA ────────────────────────────────────────────────────────
function ReviewCard({ review, isOwn = false, onEdit, onDelete }) {
    const ratingPct   = Math.round((review.rating / 10) * 100);
    const ratingColor = ratingPct >= 70 ? "#4ade80" : ratingPct >= 50 ? "#fbbf24" : "#f87171";
    const ratingBar   = ratingPct >= 70 ? "#22c55e" : ratingPct >= 50 ? "#eab308" : "#ef4444";

    return (
        <div
            className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${isOwn ? "rgba(124,58,237,0.28)" : "rgba(255,255,255,0.05)"}`
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = isOwn ? "rgba(124,58,237,0.45)" : "rgba(124,58,237,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = isOwn ? "rgba(124,58,237,0.28)" : "rgba(255,255,255,0.05)"}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div
                        className="rounded-full shrink-0 p-[2px]"
                        style={{
                            background: isOwn ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.07)",
                            width: "36px", height: "36px"
                        }}
                    >
                        <div className="rounded-full overflow-hidden w-full h-full" style={{ background: "#060810" }}>
                            {review.user?.avatar ? (
                                <img
                                    src={review.user.avatar}
                                    alt={review.user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                    style={{ color: "#c084fc", fontSize: "0.75rem", fontWeight: 700 }}>
                                    {review.user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{review.user?.username}</p>
                        {isOwn && (
                            <p className="text-[10px] font-medium" style={{ color: "#a855f7" }}>Tu reseña</p>
                        )}
                    </div>
                </div>

                {/* Rating con barra */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-1" style={{ width: 64 }}>
                        <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${ratingPct}%`, background: ratingBar }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: ratingColor }}>
                            {review.rating}/10
                        </span>
                    </div>
                    <div className="flex items-center gap-1 sm:hidden">
                        <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                        <span className="text-white font-bold text-sm">{review.rating}</span>
                    </div>
                </div>
            </div>

            {/* Comentario */}
            {review.comment && (
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                    {review.comment}
                </p>
            )}

            {/* Acciones */}
            {isOwn && (
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                        style={{ border: "1px solid rgba(124,58,237,0.28)", color: "#a855f7" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <Pencil size={11} /> Editar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                        style={{ border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <Trash2 size={11} /> Borrar
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Reviews({ tmdb_id, media_type, title, poster_path, vote_average }) {
    const { user } = useAuth();
    const { reviews, loading, createReview, editReview, deleteReview } = useReviews(tmdb_id, media_type);
    const [editando, setEditando] = useState(false);

    const myId         = user?.sub ?? user?.id;
    const miReseña     = reviews?.find(r => r.user_id === myId);
    const otrasReseñas = reviews?.filter(r => r.user_id !== myId);

    const handleCreate = async data => {
        await createReview({ ...data, tmdb_id, media_type, title, poster_path, vote_average });
    };
    const handleEdit = async data => {
        await editReview(miReseña.id, data);
        setEditando(false);
    };
    const handleDelete = async () => {
        await deleteReview(miReseña.id);
    };

    if (loading) return (
        <div className="flex items-center gap-3 py-6">
            <div className="w-4 h-4 rounded-full animate-spin"
                style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
            <p className="text-xs uppercase tracking-widest" style={{ color: "#374151" }}>Cargando reseñas</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-5">
            {/* Tu reseña / formulario */}
            {miReseña && !editando ? (
                <ReviewCard review={miReseña} isOwn onEdit={() => setEditando(true)} onDelete={handleDelete} />
            ) : editando ? (
                <ReviewForm initialData={miReseña} onSubmit={handleEdit} onCancel={() => setEditando(false)} />
            ) : (
                <ReviewForm onSubmit={handleCreate} />
            )}

            {/* Reseñas de la comunidad */}
            {otrasReseñas?.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-[2px] h-4 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <p className="text-xs font-semibold" style={{ color: "#4b5563" }}>
                            {otrasReseñas.length} reseña{otrasReseñas.length !== 1 ? "s" : ""} de la comunidad
                        </p>
                    </div>
                    {otrasReseñas.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}

            {otrasReseñas?.length === 0 && miReseña && (
                <p className="text-xs" style={{ color: "#374151" }}>
                    Sé el primero en compartir tu opinión con la comunidad.
                </p>
            )}
        </div>
    );
}
