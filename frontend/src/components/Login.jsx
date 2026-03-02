import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    biography: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        : {
            username: form.username,
            email: form.email,
            password: form.password,
            biography: form.biography,
          };

      const { data } = await axios.post(
        `http://localhost:3000/api/auth${endpoint}`,
        body,
        {
          withCredentials: true,
        },
      );

      if (!data.ok) {
        setError(data.mensaje);
        return;
      }

      // Guardar el usuario en el contexto
      login(data.datos);

      // Redirigir según el rol
      if (data.datos.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.mensaje || "Error de conexión con el servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* Degrado de Color para el Fondo*/}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(88,28,135,0.3) 0%, #0d1117 70%)",
        }}
      />

      {/* Contenedor central */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ border: "2px solid #a855f7" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "#a855f7" }}
              />
            </div>
            <h1
              className="text-4xl font-black text-white uppercase"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.3em" }}
            >
              Cine<span style={{ color: "#a855f7" }}>sfera</span>
            </h1>
          </div>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "#6b7280" }}
          >
            Tu universo cinematográfico
          </p>
        </div>
        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(15,15,20,0.95)",
            borderColor: "rgba(168,85,247,0.15)",
            boxShadow:
              "0 0 60px rgba(124,58,237,0.1), 0 25px 50px rgba(0,0,0,0.8)",
          }}
        >
          {/* Toggle */}
          <div
            className="flex mb-8 rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <button
              onClick={() => setIsLogin(true)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
              style={
                isLogin
                  ? {
                      background: "#7c3aed",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(124,58,237,0.5)",
                    }
                  : { color: "#6b7280" }
              }
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
              style={
                !isLogin
                  ? {
                      background: "#7c3aed",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(124,58,237,0.5)",
                    }
                  : { color: "#6b7280" }
              }
            >
              Registrarse
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#9ca3af" }}
                >
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Tu nombre en Cinesfera"
                  className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label
                className="text-xs uppercase tracking-widest"
                style={{ color: "#9ca3af" }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-xs uppercase tracking-widest"
                style={{ color: "#9ca3af" }}
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#9ca3af" }}
                >
                  Biografía <span style={{ color: "#4b5563" }}>(opcional)</span>
                </label>
                <textarea
                  name="biography"
                  value={form.biography}
                  onChange={handleChange}
                  placeholder="Cuéntanos algo sobre ti..."
                  rows={3}
                  className="rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            )}

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm text-white transition-all duration-200"
              style={{
                background: loading
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 25px rgba(124,58,237,0.5), 0 0 0 1px rgba(168,85,247,0.2)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.15em",
              }}
            >
              {loading ? "Cargando..." : isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>

      {/* Tira izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="h-6 mx-1 rounded-sm"
            style={{ background: "#374151" }}
          />
        ))}
      </div>

      {/* Tira derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="h-6 mx-1 rounded-sm"
            style={{ background: "#374151" }}
          />
        ))}
      </div>

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
}
