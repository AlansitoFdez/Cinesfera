import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, User, Lock, Trash2, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function Settings() {
  const { user } = useAuth();

  // activeTab guarda qué sección está activa: "profile", "security" o "delete"
  const [activeTab, setActiveTab] = useState("profile");

  // Las pestañas del menú lateral
  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "security", label: "Seguridad", icon: Lock },
    { id: "delete", label: "Eliminar cuenta", icon: Trash2, danger: true },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d1117" }}
    >
      {/* Fondo degradado igual que en Login */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, rgba(88,28,135,0.2) 0%, #0d1117 65%)",
        }}
      />

      {/* Contenido con padding-top para que no quede debajo del navbar flotante */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-16">

        {/* Título de página */}
        <div className="mb-8">
          <h1
            className="text-2xl font-black text-white uppercase tracking-widest"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Configura<span style={{ color: "#a855f7" }}>ción</span>
          </h1>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#6b7280" }}>
            Gestiona tu perfil y tu cuenta
          </p>
        </div>

        {/* Layout de dos columnas: menú lateral + contenido */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* ── MENÚ LATERAL ── */}
          <aside className="md:w-48 flex-shrink-0">
            <nav className="flex flex-row md:flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 w-full text-left"
                    style={{
                      background: isActive
                        ? tab.danger
                          ? "rgba(239,68,68,0.12)"
                          : "rgba(124,58,237,0.15)"
                        : "transparent",
                      border: isActive
                        ? tab.danger
                          ? "1px solid rgba(239,68,68,0.25)"
                          : "1px solid rgba(168,85,247,0.25)"
                        : "1px solid transparent",
                      color: isActive
                        ? tab.danger
                          ? "#f87171"
                          : "#c084fc"
                        : "#6b7280",
                    }}
                  >
                    <Icon size={15} />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── PANEL DERECHO ── */}
          <main
            className="flex-1 rounded-2xl p-6 md:p-8"
            style={{
              background: "rgba(15,15,20,0.95)",
              border: "1px solid rgba(168,85,247,0.15)",
              boxShadow: "0 0 40px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {activeTab === "profile" && <ProfileSection user={user} />}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "delete" && <DeleteSection user={user} />}
          </main>

        </div>
      </div>
    </div>
  );
}


// ─── SECCIÓN: PERFIL ─────────────────────────────────────────────────────────
function ProfileSection({ user }) {
  // Estado del formulario: se inicializa con los datos del usuario actual
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    biography: user?.biography || "",
  });

  // avatarPreview guarda la URL de previsualización de la imagen elegida
  const [avatarPreview, setAvatarPreview] = useState(null);

  // saved controla si mostramos el mensaje de "Cambios guardados"
  const [saved, setSaved] = useState(false);

  // inputRef nos permite abrir el selector de archivos al hacer clic en el avatar
  const inputRef = useRef(null);

  // Cada vez que el usuario escribe en un input, actualizamos el campo correspondiente
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cuando el usuario elige una imagen, creamos una URL temporal para previsualizarla
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  // Al guardar: simulamos el guardado y mostramos el mensaje de éxito
  const handleSave = () => {
    // Aquí irá la llamada a la API cuando esté lista
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-7">
      <SectionHeader title="Perfil público" subtitle="Así te verán los demás usuarios de Cinesfera" />

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {/* Círculo del avatar: muestra la previsualización o las iniciales */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: avatarPreview ? "transparent" : "rgba(124,58,237,0.2)",
              border: "2px solid rgba(168,85,247,0.4)",
            }}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-purple-400" style={{ fontFamily: "'Georgia', serif" }}>
                {/* Mostramos la primera letra del username */}
                {(user?.username || "U")[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Botón de cámara encima del avatar */}
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "#7c3aed",
              border: "2px solid #0d1117",
            }}
          >
            <Camera size={12} color="white" />
          </button>
        </div>

        {/* Input oculto para seleccionar fichero — el botón de cámara lo activa */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div>
          <p className="text-sm font-semibold text-white">{user?.username}</p>
          <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
            JPG, PNG o WEBP · Máx. 2MB
          </p>
        </div>
      </div>

      {/* Campos de texto */}
      <div className="flex flex-col gap-4">
        <Field
          label="Nombre de usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Tu nombre en Cinesfera"
        />
        <Field
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
        />
        <Field
          label="Biografía"
          name="biography"
          value={form.biography}
          onChange={handleChange}
          placeholder="Cuéntanos algo sobre ti..."
          multiline
        />
      </div>

      {/* Botón guardar + mensaje de éxito */}
      <div className="flex items-center gap-4 pt-2">
        <SaveButton onClick={handleSave} />
        {saved && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
            <CheckCircle size={15} />
            <span>Cambios guardados</span>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── SECCIÓN: SEGURIDAD ───────────────────────────────────────────────────────
function SecuritySection() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // showX controla si cada contraseña se muestra como texto o como puntos
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSave = () => {
    // Validación básica antes de llamar a la API
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Rellena todos los campos.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    // Aquí irá la llamada a la API cuando esté lista
    setSaved(true);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-7">
      <SectionHeader title="Cambiar contraseña" subtitle="Usa una contraseña segura que no uses en ningún otro sitio" />

      <div className="flex flex-col gap-4">
        <PasswordField
          label="Contraseña actual"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          visible={show.current}
          onToggle={() => toggleShow("current")}
        />
        <PasswordField
          label="Nueva contraseña"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          visible={show.new}
          onToggle={() => toggleShow("new")}
        />
        <PasswordField
          label="Confirmar nueva contraseña"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          visible={show.confirm}
          onToggle={() => toggleShow("confirm")}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <SaveButton onClick={handleSave} label="Actualizar contraseña" />
        {saved && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
            <CheckCircle size={15} />
            <span>Contraseña actualizada</span>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── SECCIÓN: ELIMINAR CUENTA ─────────────────────────────────────────────────
function DeleteSection({ user }) {
  // confirmed controla si el usuario ha escrito su nombre para confirmar
  const [confirmText, setConfirmText] = useState("");

  // showModal controla la visibilidad del modal de confirmación final
  const [showModal, setShowModal] = useState(false);

  // Solo se puede continuar si el texto coincide exactamente con el username
  const isMatch = confirmText === user?.username;

  const handleDelete = () => {
    // Aquí irá la llamada a la API cuando esté lista
    setShowModal(false);
    alert("Cuenta eliminada (simulación — conectar API)");
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        <SectionHeader
          title="Eliminar cuenta"
          subtitle="Esta acción es permanente e irreversible"
          danger
        />

        {/* Aviso visual */}
        <div
          className="rounded-xl px-5 py-4 flex gap-3"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={18} style={{ color: "#f87171", flexShrink: 0, marginTop: "2px" }} />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold" style={{ color: "#f87171" }}>
              Se eliminarán permanentemente:
            </p>
            <ul className="text-sm" style={{ color: "#9ca3af" }}>
              <li>· Tu perfil y datos personales</li>
              <li>· Tu historial y lista de favoritos</li>
              <li>· Tus conexiones con amigos</li>
            </ul>
          </div>
        </div>

        {/* Campo de confirmación: el usuario debe escribir su nombre exacto */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
            Escribe <span style={{ color: "#f87171" }}>{user?.username}</span> para confirmar
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={user?.username}
            className="rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: isMatch
                ? "1px solid rgba(239,68,68,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Botón de eliminar — solo activo cuando el texto coincide */}
        <button
          disabled={!isMatch}
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-xl font-bold tracking-widest uppercase text-sm transition-all duration-200"
          style={{
            background: isMatch ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)",
            border: isMatch ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.06)",
            color: isMatch ? "#f87171" : "#4b5563",
            cursor: isMatch ? "pointer" : "not-allowed",
          }}
        >
          Eliminar mi cuenta
        </button>
      </div>

      {/* Modal de confirmación final */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-5"
            style={{
              background: "rgba(15,15,20,0.98)",
              border: "1px solid rgba(239,68,68,0.3)",
              boxShadow: "0 0 60px rgba(239,68,68,0.1), 0 25px 50px rgba(0,0,0,0.8)",
            }}
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black text-white">¿Estás seguro?</h3>
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Esta acción no se puede deshacer. Tu cuenta y todos tus datos desaparecerán para siempre.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#f87171",
                  cursor: "pointer",
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// ─── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────

// Cabecera de cada sección con título y subtítulo
function SectionHeader({ title, subtitle, danger }) {
  return (
    <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <h2
        className="text-lg font-bold text-white tracking-wide"
        style={{ color: danger ? "#f87171" : "white" }}
      >
        {title}
      </h2>
      <p className="text-xs tracking-wide" style={{ color: "#6b7280" }}>{subtitle}</p>
    </div>
  );
}

// Campo de texto genérico (input o textarea)
function Field({ label, name, value, onChange, placeholder, type = "text", multiline = false }) {
  const sharedStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="rounded-xl px-4 py-3 text-sm text-white outline-none"
          style={sharedStyle}
        />
      )}
    </div>
  );
}

// Campo de contraseña con botón para mostrar/ocultar
function PasswordField({ label, name, value, onChange, visible, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none pr-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        {/* Botón ojo — alterna entre mostrar y ocultar la contraseña */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// Botón de guardar reutilizable con el estilo morado de Cinesfera
function SaveButton({ onClick, label = "Guardar cambios" }) {
  return (
    <button
      onClick={onClick}
      className="py-3 px-6 rounded-xl font-bold tracking-widest uppercase text-sm text-white transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        boxShadow: "0 4px 15px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.2)",
        cursor: "pointer",
        letterSpacing: "0.1em",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.6), 0 0 0 1px rgba(168,85,247,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(124,58,237,0.4), 0 0 0 1px rgba(168,85,247,0.2)";
      }}
    >
      {label}
    </button>
  );
}
