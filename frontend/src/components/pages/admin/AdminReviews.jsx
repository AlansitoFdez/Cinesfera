import { useState, useEffect } from "react"
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import useAdmin from "../../../hooks/useAdmin"
import ConfirmModal from "../../ui/ConfirmModal"

const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s"
}

const onFocus = e => {
    e.target.style.borderColor = "rgba(168,85,247,0.5)"
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"
}

const onBlur = e => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)"
    e.target.style.boxShadow = "none"
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminReviews() {
    const { reviews, loading, reviewsPagination, getReviews, deleteReview } = useAdmin()
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [confirm, setConfirm] = useState(null)

    useEffect(() => { getReviews({ page, search }) }, [page])

    const handleSearch = e => {
        e.preventDefault()
        setPage(1)
        getReviews({ page: 1, search })
    }

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
    )

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#060810" }}>
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Gestión de reseñas</h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                        {reviewsPagination.total} reseñas en total
                    </p>
                </div>

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.12) 30%, rgba(168,85,247,0.12) 70%, transparent)" }} />

                {/* Buscador */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7280" }} />
                        <input
                            type="text"
                            placeholder="Buscar por usuario..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full text-sm"
                            style={{ ...inputStyle, padding: "9px 14px 9px 36px" }}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
                        style={{
                            background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                            boxShadow: "0 0 16px rgba(109,40,217,0.35)"
                        }}
                    >
                        Buscar
                    </button>
                </form>

                {/* Tabla — overflow-x-auto para móvil */}
                <div className="rounded-xl overflow-hidden overflow-x-auto"
                    style={{ border: "1px solid rgba(168,85,247,0.12)" }}>
                    <Table>
                        <TableHeader>
                            <TableRow style={{
                                borderBottom: "1px solid rgba(168,85,247,0.12)",
                                background: "rgba(124,58,237,0.04)"
                            }}>
                                {["Usuario", "Contenido", "Tipo", "Puntuación", "Comentario", "Fecha", "Acciones"].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                        style={{ color: "#6b7280" }}>
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map(review => (
                                <TableRow
                                    key={review.id}
                                    className="transition-colors duration-150"
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <TableCell className="font-semibold text-white whitespace-nowrap">
                                        {review.user?.username}
                                    </TableCell>
                                    <TableCell className="text-sm whitespace-nowrap" style={{ color: "#9ca3af" }}>
                                        {review.tmdb?.title}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap"
                                            style={review.tmdb?.media_type === "movie"
                                                ? { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }
                                                : { background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }
                                            }>
                                            {review.tmdb?.media_type === "movie" ? "Película" : "Serie"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                                            <span className="text-white font-bold text-sm">{review.rating}</span>
                                            <span className="text-xs" style={{ color: "#4b5563" }}>/10</span>
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ color: "#6b7280", maxWidth: "180px" }}>
                                        <p className="truncate text-sm">{review.comment || "—"}</p>
                                    </TableCell>
                                    <TableCell className="text-sm whitespace-nowrap" style={{ color: "#4b5563" }}>
                                        {new Date(review.created_at).toLocaleDateString("es-ES")}
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => setConfirm({
                                                message: `¿Eliminar la reseña de ${review.user?.username} sobre "${review.tmdb?.title}"?`,
                                                onConfirm: () => { deleteReview(review.id); setConfirm(null) }
                                            })}
                                            title="Eliminar reseña"
                                            className="rounded-lg p-1.5 transition-all duration-200"
                                            style={{ background: "rgba(255,255,255,0.04)" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                                        >
                                            <Trash2 size={14} style={{ color: "#f87171" }} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: "#4b5563" }}>
                        Página <span className="text-white font-semibold">{reviewsPagination.page}</span> de{" "}
                        <span className="text-white font-semibold">{reviewsPagination.totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        {[
                            { icon: ChevronLeft, action: () => setPage(p => p - 1), disabled: page === 1 },
                            { icon: ChevronRight, action: () => setPage(p => p + 1), disabled: page === reviewsPagination.totalPages }
                        ].map(({ icon: Icon, action, disabled }, i) => (
                            <button
                                key={i}
                                onClick={action}
                                disabled={disabled}
                                className="rounded-lg p-2 transition-all duration-200"
                                style={{
                                    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                                    color: disabled ? "#2d3748" : "#9ca3af",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    border: "1px solid rgba(168,85,247,0.08)"
                                }}
                                onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)" }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)" }}
                            >
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    onConfirm={confirm.onConfirm}
                    onClose={() => setConfirm(null)}
                />
            )}
        </div>
    )
}
