import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import api from "../../api.js";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SplitText from "../ui/SplitText";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const cardRef = useRef(null);

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: "", email: "", password: "", biography: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Entrada de la card al montar
    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.15 }
        );
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const endpoint = isLogin ? "/login" : "/signup";
            const body = isLogin
                ? { email: form.email, password: form.password }
                : { username: form.username, email: form.email, password: form.password, biography: form.biography };

            const response = await api.post(`/auth${endpoint}`, body);
            login(response.datos);
            navigate("/home");
        } catch (err) {
            setError(err.mensaje || "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        color: "#fff",
        padding: "11px 16px",
        fontSize: "0.9rem",
        outline: "none",
        width: "100%",
        transition: "border-color 0.2s, box-shadow 0.2s"
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = "rgba(168,85,247,0.5)";
        e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = "rgba(255,255,255,0.08)";
        e.target.style.boxShadow = "none";
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: "#0d1117" }}
        >
            {/* Fondo — dos acentos radiales */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 60% 50% at 65% 35%, rgba(88,28,135,0.28) 0%, transparent 70%)"
            }} />
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,58,237,0.1) 0%, transparent 70%)"
            }} />

            {/* Tira de película izquierda */}
            <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ opacity: 0.18 }}>
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(to bottom, #0d1117 0%, transparent 15%, transparent 85%, #0d1117 100%)"
                }} />
                <div className="flex flex-col justify-around h-full">
                    {Array.from({ length: 22 }).map((_, i) => (
                        <div key={i} className="h-5 mx-1 rounded-sm" style={{ background: "#374151" }} />
                    ))}
                </div>
            </div>

            {/* Tira de película derecha */}
            <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ opacity: 0.18 }}>
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(to bottom, #0d1117 0%, transparent 15%, transparent 85%, #0d1117 100%)"
                }} />
                <div className="flex flex-col justify-around h-full">
                    {Array.from({ length: 22 }).map((_, i) => (
                        <div key={i} className="h-5 mx-1 rounded-sm" style={{ background: "#374151" }} />
                    ))}
                </div>
            </div>

            {/* Viñeta */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)" }}
            />

            {/* Contenido central */}
            <div ref={cardRef} className="relative z-10 w-full max-w-md mx-4">

                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-3">
                        {/* Icono */}
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ border: "2px solid #a855f7" }}
                        >
                            <div className="w-3 h-3 rounded-full" style={{ background: "#a855f7" }} />
                        </div>

                        {/* Nombre con SplitText */}
                        <h1 className="text-4xl font-bold text-white" style={{ letterSpacing: "0.22em" }}>
                            <SplitText text="Cin" delay={0.1} duration={0.4} stagger={0.03} y={10} />
                            <SplitText
                                text="esfera"
                                className="text-purple-400"
                                delay={0.25}
                                duration={0.4}
                                stagger={0.03}
                                y={10}
                            />
                        </h1>
                    </div>
                    <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "#4b5563" }}>
                        Tu universo cinematográfico
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: "rgba(12,13,18,0.96)",
                        border: "1px solid rgba(168,85,247,0.14)",
                        boxShadow: "0 0 80px rgba(124,58,237,0.08), 0 32px 64px rgba(0,0,0,0.7)"
                    }}
                >
                    {/* Toggle login / registro */}
                    <div
                        className="flex mb-8 rounded-xl p-1"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                        {[
                            { label: "Iniciar sesión", value: true },
                            { label: "Registrarse", value: false }
                        ].map(({ label, value }) => (
                            <button
                                key={label}
                                onClick={() => { setIsLogin(value); setError(""); }}
                                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-250"
                                style={isLogin === value
                                    ? { background: "#7c3aed", color: "#fff", boxShadow: "0 4px 14px rgba(124,58,237,0.45)" }
                                    : { color: "#6b7280" }
                                }
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Formulario */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        {/* Username (solo registro) */}
                        {!isLogin && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                                    Nombre de usuario
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Tu nombre en Cinesfera"
                                    style={inputStyle}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>

                        {/* Biografía (solo registro) */}
                        {!isLogin && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                                    Biografía{" "}
                                    <span style={{ color: "#374151", textTransform: "none", letterSpacing: 0 }}>
                                        (opcional)
                                    </span>
                                </label>
                                <textarea
                                    name="biography"
                                    value={form.biography}
                                    onChange={handleChange}
                                    placeholder="Cuéntanos algo sobre ti..."
                                    rows={3}
                                    style={{ ...inputStyle, resize: "none" }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div
                                className="rounded-xl px-4 py-3 text-sm"
                                style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    color: "#f87171"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
                            style={{
                                background: loading
                                    ? "rgba(124,58,237,0.35)"
                                    : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                boxShadow: loading
                                    ? "none"
                                    : "0 8px 24px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.15)",
                                cursor: loading ? "not-allowed" : "pointer",
                                transform: loading ? "scale(1)" : undefined
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                        style={{ borderColor: "rgba(255,255,255,0.6) rgba(255,255,255,0.6) rgba(255,255,255,0.6) transparent" }}
                                    />
                                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                                        {isLogin ? "Entrando..." : "Creando cuenta..."}
                                    </span>
                                </>
                            ) : (
                                isLogin ? "Entrar" : "Crear cuenta"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
