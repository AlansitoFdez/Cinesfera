import { useState, useEffect } from "react"
import { Shield, ShieldOff, Trash2, UserCog, Search, ChevronLeft, ChevronRight } from "lucide-react"
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

// ─── ACCIÓN BUTTON ────────────────────────────────────────────────────────────
function ActionBtn({ onClick, title, children, danger }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className="rounded-lg p-1.5 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)" }}
            onMouseEnter={e => e.currentTarget.style.background = danger ? "rgba(239,68,68,0.12)" : "rgba(168,85,247,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        >
            {children}
        </button>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminUsers() {
    const { users, loading, usersPagination, getUsers, banUser, changeRole, deleteUser } = useAdmin()
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [confirm, setConfirm] = useState(null)

    useEffect(() => { getUsers({ page, search }) }, [page])

    const handleSearch = e => {
        e.preventDefault()
        setPage(1)
        getUsers({ page: 1, search })
    }

    const askConfirm = (message, action) => setConfirm({ message, onConfirm: action })

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
            <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
            <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
        </div>
    )

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestión de usuarios</h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                        {usersPagination.total} usuarios registrados
                    </p>
                </div>

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.12) 30%, rgba(168,85,247,0.12) 70%, transparent)" }} />

                {/* Buscador */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7280" }} />
                        <input
                            type="text"
                            placeholder="Buscar por usuario o email..."
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
                            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                            boxShadow: "0 0 14px rgba(124,58,237,0.3)"
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
                                {["Usuario", "Email", "Rol", "Estado", "Registro", "Acciones"].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                        style={{ color: "#6b7280" }}>
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow
                                    key={user.id}
                                    className="transition-colors duration-150"
                                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.04)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <TableCell className="font-semibold text-white whitespace-nowrap">
                                        {user.username}
                                    </TableCell>
                                    <TableCell className="text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap"
                                            style={user.role === "ADMIN"
                                                ? { background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.25)" }
                                                : { background: "rgba(255,255,255,0.04)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }
                                            }>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap"
                                            style={user.banned
                                                ? { background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                                                : { background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.18)" }
                                            }>
                                            {user.banned ? "Baneado" : "Activo"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm whitespace-nowrap" style={{ color: "#4b5563" }}>
                                        {new Date(user.created_at).toLocaleDateString("es-ES")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <ActionBtn
                                                title={user.banned ? "Desbanear" : "Banear"}
                                                danger
                                                onClick={() => askConfirm(
                                                    `¿${user.banned ? "Desbanear" : "Banear"} a ${user.username}?`,
                                                    () => { banUser(user.id); setConfirm(null) }
                                                )}
                                            >
                                                {user.banned
                                                    ? <ShieldOff size={14} style={{ color: "#4ade80" }} />
                                                    : <Shield size={14} style={{ color: "#f87171" }} />
                                                }
                                            </ActionBtn>
                                            <ActionBtn
                                                title="Cambiar rol"
                                                onClick={() => askConfirm(
                                                    `¿Cambiar rol de ${user.username} a ${user.role === "ADMIN" ? "USER" : "ADMIN"}?`,
                                                    () => { changeRole(user.id); setConfirm(null) }
                                                )}
                                            >
                                                <UserCog size={14} style={{ color: "#a855f7" }} />
                                            </ActionBtn>
                                            <ActionBtn
                                                title="Eliminar usuario"
                                                danger
                                                onClick={() => askConfirm(
                                                    `¿Eliminar permanentemente a ${user.username}? Esta acción no se puede deshacer.`,
                                                    () => { deleteUser(user.id); setConfirm(null) }
                                                )}
                                            >
                                                <Trash2 size={14} style={{ color: "#f87171" }} />
                                            </ActionBtn>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: "#4b5563" }}>
                        Página <span className="text-white font-semibold">{usersPagination.page}</span> de{" "}
                        <span className="text-white font-semibold">{usersPagination.totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        {[
                            { icon: ChevronLeft, action: () => setPage(p => p - 1), disabled: page === 1 },
                            { icon: ChevronRight, action: () => setPage(p => p + 1), disabled: page === usersPagination.totalPages }
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
