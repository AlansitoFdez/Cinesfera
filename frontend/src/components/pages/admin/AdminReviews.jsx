import { useState, useEffect } from "react"
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../../ui/table"
import useAdmin from "../../../hooks/useAdmin"

// ─── MODAL CONFIRMAR ELIMINACIÓN ─────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6"
                style={{
                    background: "rgba(15,15,20,0.98)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    boxShadow: "0 0 60px rgba(239,68,68,0.1)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-white text-sm">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold uppercase tracking-widest"
                        style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold uppercase tracking-widest"
                        style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminReviews() {
    const { reviews, loading, reviewsPagination, getReviews, deleteReview } = useAdmin()

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [confirm, setConfirm] = useState(null)

    useEffect(() => {
        getReviews({ page, search })
    }, [page])

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        getReviews({ page: 1, search })
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando reseñas...</p>
        </div>
    )

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-widest"
                        style={{ fontFamily: "'Georgia', serif" }}>
                        Gestión de Reseñas
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                        {reviewsPagination.total} reseñas en total
                    </p>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: "rgba(168,85,247,0.15)" }} />

                {/* Buscador */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                        <input
                            type="text"
                            placeholder="Buscar por usuario..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-widest"
                        style={{ background: "rgba(124,58,237,0.8)", color: "white" }}
                    >
                        Buscar
                    </button>
                </form>

                {/* Tabla */}
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(168,85,247,0.15)" }}>
                    <Table>
                        <TableHeader>
                            <TableRow style={{ borderBottom: "1px solid rgba(168,85,247,0.15)", background: "rgba(255,255,255,0.02)" }}>
                                <TableHead style={{ color: "#9ca3af" }}>Usuario</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Contenido</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Tipo</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Puntuación</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Comentario</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Fecha</TableHead>
                                <TableHead style={{ color: "#9ca3af" }}>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map(review => (
                                <TableRow
                                    key={review.id}
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <TableCell className="font-medium text-white">
                                        {review.user?.username}
                                    </TableCell>
                                    <TableCell style={{ color: "#9ca3af" }}>
                                        {review.tmdb?.title}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className="text-xs rounded-full px-2.5 py-1 font-semibold uppercase tracking-widest"
                                            style={review.tmdb?.media_type === "movie"
                                                ? { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }
                                                : { background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }
                                            }
                                        >
                                            {review.tmdb?.media_type === "movie" ? "Película" : "Serie"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-white font-bold">
                                            {review.rating}
                                            <span style={{ color: "#6b7280" }}>/10</span>
                                        </span>
                                    </TableCell>
                                    <TableCell style={{ color: "#9ca3af", maxWidth: "200px" }}>
                                        <p className="truncate">{review.comment}</p>
                                    </TableCell>
                                    <TableCell style={{ color: "#6b7280" }}>
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
                                            style={{ background: "rgba(255,255,255,0.05)" }}
                                        >
                                            <Trash2 size={15} style={{ color: "#f87171" }} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                        Página {reviewsPagination.page} de {reviewsPagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                            className="rounded-xl p-2 transition-all duration-200"
                            style={page === 1
                                ? { background: "rgba(255,255,255,0.03)", color: "#374151", cursor: "not-allowed" }
                                : { background: "rgba(255,255,255,0.05)", color: "#9ca3af" }
                            }
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === reviewsPagination.totalPages}
                            className="rounded-xl p-2 transition-all duration-200"
                            style={page === reviewsPagination.totalPages
                                ? { background: "rgba(255,255,255,0.03)", color: "#374151", cursor: "not-allowed" }
                                : { background: "rgba(255,255,255,0.05)", color: "#9ca3af" }
                            }
                        >
                            <ChevronRight size={16} />
                        </button>
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