import { useState } from "react";
import useReviews from "../../hooks/useReviews";
import {useAuth} from "../../hooks/UseAuth";

// ─── ESTRELLAS ────────────────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange && onChange(star)}
                    style={{
                        color: star <= value ? "#fbbf24" : "#374151",
                        fontSize: "1.2rem",
                        background: "none",
                        border: "none",
                        cursor: readonly ? "default" : "pointer",
                        padding: "0 1px"
                    }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

// ─── FORMULARIO ───────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit, initialData = null, onCancel }) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [comment, setComment] = useState(initialData?.comment || "");

    const handleSubmit = () => {
        if (!rating) return;
        onSubmit({ rating, comment });
    };

    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
                background: "rgba(15,15,20,0.95)",
                border: "1px solid rgba(168,85,247,0.2)"
            }}
        >
            <p className="text-white font-semibold">
                {initialData ? "Editar tu reseña" : "¿Qué te pareció?"}
            </p>

            {/* Rating */}
            <div className="flex flex-col gap-2">
                <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Valoración</span>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && (
                    <span style={{ color: "#c084fc", fontSize: "0.85rem" }}>{rating}/10</span>
                )}
            </div>

            {/* Comentario */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos tu opinión... (opcional)"
                rows={3}
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    borderRadius: "12px",
                    color: "#d1d5db",
                    padding: "12px",
                    fontSize: "0.9rem",
                    resize: "none",
                    outline: "none",
                    width: "100%"
                }}
            />

            {/* Botones */}
            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={!rating}
                    style={{
                        background: rating ? "rgba(124,58,237,0.8)" : "rgba(124,58,237,0.2)",
                        border: "1px solid rgba(168,85,247,0.3)",
                        borderRadius: "10px",
                        color: rating ? "#fff" : "#6b7280",
                        padding: "8px 20px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: rating ? "pointer" : "not-allowed"
                    }}
                >
                    {initialData ? "Guardar cambios" : "Publicar reseña"}
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "10px",
                            color: "#6b7280",
                            padding: "8px 20px",
                            fontSize: "0.9rem",
                            cursor: "pointer"
                        }}
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
    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
                background: "rgba(15,15,20,0.95)",
                border: `1px solid ${isOwn ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)"}`
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {review.user?.avatar ? (
                        <img
                            src={review.user.avatar}
                            alt={review.user.username}
                            className="rounded-full object-cover"
                            style={{ width: "36px", height: "36px", border: "1px solid rgba(168,85,247,0.2)" }}
                        />
                    ) : (
                        <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                                width: "36px",
                                height: "36px",
                                background: "rgba(124,58,237,0.15)",
                                border: "1px solid rgba(168,85,247,0.2)",
                                color: "#c084fc",
                                fontSize: "0.85rem",
                                fontWeight: "700"
                            }}
                        >
                            {review.user?.username?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="text-white text-sm font-semibold">{review.user?.username}</p>
                        {isOwn && (
                            <p style={{ color: "#c084fc", fontSize: "0.75rem" }}>Tu reseña</p>
                        )}
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <span style={{ color: "#fbbf24" }}>★</span>
                    <span className="text-white font-bold">{review.rating}</span>
                    <span style={{ color: "#4b5563", fontSize: "0.85rem" }}>/10</span>
                </div>
            </div>

            {/* Comentario */}
            {review.comment && (
                <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {review.comment}
                </p>
            )}

            {/* Botones editar/borrar si es la reseña propia */}
            {isOwn && (
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={onEdit}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(168,85,247,0.3)",
                            borderRadius: "8px",
                            color: "#c084fc",
                            padding: "4px 14px",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                        }}
                    >
                        Editar
                    </button>
                    <button
                        onClick={onDelete}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "8px",
                            color: "#f87171",
                            padding: "4px 14px",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                        }}
                    >
                        Borrar
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

    // Buscar si el usuario actual ya tiene reseña
    const miReseña = reviews?.find(r => r.user_id === user?.id);

    // Reseñas de otros usuarios
    const otrasReseñas = reviews?.filter(r => r.user_id !== user?.id);

    const handleCreate = async (reviewData) => {
        await createReview({ ...reviewData, tmdb_id, media_type, title, poster_path, vote_average });
    };

    const handleEdit = async (reviewData) => {
        await editReview(miReseña.id, reviewData);
        setEditando(false);
    };

    const handleDelete = async () => {
        await deleteReview(miReseña.id);
    };

    if (loading) {
        return (
            <div style={{ color: "#4b5563", fontSize: "0.9rem", padding: "20px 0" }}>
                Cargando reseñas...
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* ── Sección del usuario actual ── */}
            {miReseña && !editando ? (
                <ReviewCard
                    review={miReseña}
                    isOwn={true}
                    onEdit={() => setEditando(true)}
                    onDelete={handleDelete}
                />
            ) : editando ? (
                <ReviewForm
                    initialData={miReseña}
                    onSubmit={handleEdit}
                    onCancel={() => setEditando(false)}
                />
            ) : (
                <ReviewForm onSubmit={handleCreate} />
            )}

            {/* ── Reseñas de otros usuarios ── */}
            {otrasReseñas?.length > 0 && (
                <div className="flex flex-col gap-4">
                    <p
                        className="uppercase tracking-widest text-sm"
                        style={{ color: "#6b7280" }}
                    >
                        {otrasReseñas.length} reseña{otrasReseñas.length !== 1 ? "s" : ""} de otros usuarios
                    </p>
                    {otrasReseñas.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}

            {/* ── Sin reseñas de otros ── */}
            {otrasReseñas?.length === 0 && miReseña && (
                <p style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                    Sé el primero en compartir tu opinión con la comunidad.
                </p>
            )}
        </div>
    );
}
