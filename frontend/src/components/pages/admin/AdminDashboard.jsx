import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Users, MessageSquare, ShieldOff, Shield, ArrowRight } from "lucide-react"
import { gsap } from "gsap"
import useAdmin from "../../../hooks/useAdmin"

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div
            className="rounded-xl p-5 flex items-center gap-4 transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.08)"
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)"
                e.currentTarget.style.background = "rgba(124,58,237,0.05)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)"
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            }}
        >
            <div
                className="rounded-xl p-3 shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
                <Icon size={20} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
                <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>{label}</p>
            </div>
        </div>
    )
}

// ─── QUICK ACCESS CARD ────────────────────────────────────────────────────────
function QuickAccessCard({ label, description, to }) {
    const navigate = useNavigate()
    return (
        <div
            className="rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.08)"
            }}
            onClick={() => navigate(to)}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"
                e.currentTarget.style.background = "rgba(124,58,237,0.06)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)"
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            }}
        >
            <p className="text-white font-semibold text-sm">{label}</p>
            <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{description}</p>
            <div className="flex items-center gap-1 mt-auto" style={{ color: "#a855f7" }}>
                <span className="text-xs font-semibold">Ir</span>
                <ArrowRight size={12} />
            </div>
        </div>
    )
}

// ─── SECCIÓN LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-[3px] h-4 rounded-full shrink-0"
                style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                {children}
            </p>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { stats, loading, getStats } = useAdmin()
    const statsRef = useRef(null)

    useEffect(() => { getStats() }, [getStats])

    useEffect(() => {
        if (loading || !statsRef.current) return
        gsap.fromTo(
            [...statsRef.current.children],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
        )
    }, [loading])

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
            <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
            <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
        </div>
    )

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Panel de administración</h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                        Centro de control de Cinesfera
                    </p>
                </div>

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.12) 30%, rgba(168,85,247,0.12) 70%, transparent)" }} />

                {/* Stats */}
                <div>
                    <SectionLabel>Estadísticas generales</SectionLabel>
                    <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard icon={Users}         label="Usuarios totales"  value={stats?.totalUsers}   color="#a855f7" />
                        <StatCard icon={MessageSquare} label="Reseñas totales"   value={stats?.totalReviews} color="#60a5fa" />
                        <StatCard icon={ShieldOff}     label="Usuarios baneados" value={stats?.bannedUsers}  color="#f87171" />
                        <StatCard icon={Shield}        label="Administradores"   value={stats?.adminUsers}   color="#4ade80" />
                    </div>
                </div>

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.12) 30%, rgba(168,85,247,0.12) 70%, transparent)" }} />

                {/* Accesos rápidos */}
                <div>
                    <SectionLabel>Accesos rápidos</SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <QuickAccessCard
                            label="Gestión de usuarios"
                            description="Consulta, banea, cambia roles o elimina usuarios de la plataforma."
                            to="/admin/users"
                        />
                        <QuickAccessCard
                            label="Gestión de reseñas"
                            description="Modera el contenido generado por los usuarios de Cinesfera."
                            to="/admin/reviews"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
