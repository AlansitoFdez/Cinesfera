import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#0d1117" }}>
            <p style={{ fontSize: "6rem", fontWeight: 900, color: "rgba(168,85,247,0.2)", fontFamily: "'Georgia', serif" }}>
                404
            </p>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest"
                style={{ fontFamily: "'Georgia', serif" }}>
                Página no encontrada
            </h1>
            <p className="text-sm uppercase tracking-widest" style={{ color: "#6b7280" }}>
                Esta ruta no existe en Cinesfera
            </p>
            <button
                onClick={() => navigate("/home")}
                className="mt-4 px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest"
                style={{ background: "rgba(124,58,237,0.8)", color: "white" }}
            >
                Volver al inicio
            </button>
        </div>
    )
}