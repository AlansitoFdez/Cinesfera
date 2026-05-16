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
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)"
            }}
        >
            <div className="rounded-xl p-3 shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                <Icon size={20} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-black text-white">{value ?? "—"}</p>
                <p className="text-xs mt-0.5 uppercase tracking-wider" style={{ color: "#374151" }}>{label}</p>
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
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onClick={() => navigate(to)}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)"
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)"
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
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4b5563" }}>
                {children}
            </p>
        </div>
    )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { stats, loading, getStats } = useAdmin()
    const headerRef = useRef(null)
    const statsRef  = useRef(null)

    useEffect(() => { getStats() }, [getStats])

    useEffect(() => {
        if (!headerRef.current) return
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 20, filter: "blur(4px)" },
            { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
        )
    }, [])

    useEffect(() => {
        if (loading || !statsRef.current) return
        gsap.fromTo([...statsRef.current.children],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
        )
    }, [loading])

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
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div ref={headerRef}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Panel de administración</h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#374151" }}>Centro de control de Cinesfera</p>
                </div>

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.12) 30%, rgba(124,58,237,0.12) 70%, transparent)" }} />

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

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.12) 30%, rgba(124,58,237,0.12) 70%, transparent)" }} />

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
