import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, MessageSquare, ShieldOff, Shield } from "lucide-react"
import useAdmin from "../../../hooks/useAdmin"

// ─── TARJETA DE ESTADÍSTICA ───────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div
            className="rounded-2xl p-6 flex items-center gap-5"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.1)"
            }}
        >
            <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-black text-white">{value ?? "—"}</p>
                <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "#6b7280" }}>{label}</p>
            </div>
        </div>
    )
}

// ─── TARJETA DE ACCESO RÁPIDO ─────────────────────────────────────────────────
function QuickAccessCard({ label, description, to }) {
    const navigate = useNavigate()
    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-3 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.1)"
            }}
            onClick={() => navigate(to)}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.1)"}
        >
            <p className="text-white font-bold uppercase tracking-widest text-sm">{label}</p>
            <p className="text-xs" style={{ color: "#6b7280" }}>{description}</p>
            <span className="text-xs mt-auto" style={{ color: "#a855f7" }}>Ir →</span>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { stats, loading, getStats } = useAdmin()

    useEffect(() => {
        getStats()
    }, [getStats])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando panel...</p>
        </div>
    )

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div>
                    <h1
                        className="text-3xl font-black text-white uppercase tracking-widest"
                        style={{ fontFamily: "'Georgia', serif" }}
                    >
                        Panel de Administración
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                        Bienvenido al centro de control de Cinesfera
                    </p>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: "rgba(168,85,247,0.15)" }} />

                {/* Stats */}
                <div>
                    <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
                        Estadísticas generales
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Users}        label="Usuarios totales"  value={stats?.totalUsers}   color="#a855f7" />
                        <StatCard icon={MessageSquare} label="Reseñas totales"   value={stats?.totalReviews} color="#60a5fa" />
                        <StatCard icon={ShieldOff}    label="Usuarios baneados" value={stats?.bannedUsers}  color="#f87171" />
                        <StatCard icon={Shield}       label="Administradores"   value={stats?.adminUsers}   color="#4ade80" />
                    </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: "rgba(168,85,247,0.15)" }} />

                {/* Accesos rápidos */}
                <div>
                    <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#6b7280" }}>
                        Accesos rápidos
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <QuickAccessCard
                            label="Gestión de Usuarios"
                            description="Consulta, banea, cambia roles o elimina usuarios de la plataforma."
                            to="/admin/users"
                        />
                        <QuickAccessCard
                            label="Gestión de Reseñas"
                            description="Modera el contenido generado por los usuarios de Cinesfera."
                            to="/admin/reviews"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}