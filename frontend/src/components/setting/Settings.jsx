import { useState, useRef } from "react";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Camera, User, Lock, Trash2, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

// ─── ESTILOS COMPARTIDOS ─────────────────────────────────────────────────────
const inputBase = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s"
};

const onFocus = (e) => {
    e.target.style.borderColor = "rgba(168,85,247,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
};

const onBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile",  label: "Perfil",           icon: User  },
        { id: "security", label: "Seguridad",         icon: Lock  },
        { id: "delete",   label: "Eliminar cuenta",   icon: Trash2, danger: true },
    ];

    return (
        <div className="min-h-screen" style={{ background: "#060810" }}>
            <div className="fixed inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at 70% 20%, rgba(109,40,217,0.12) 0%, transparent 65%)"
            }} />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-28 pb-16">

                {/* Título */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Configuración
                        </h1>
                    </div>
                    <p className="text-xs pl-6" style={{ color: "#4b5563" }}>
                        Gestiona tu perfil y tu cuenta
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar nav */}
                    <aside className="md:w-48 shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full text-left"
                                        style={{
                                            background: isActive
                                                ? (tab.danger ? "rgba(239,68,68,0.1)" : "rgba(124,58,237,0.12)")
                                                : "transparent",
                                            border: isActive
                                                ? (tab.danger ? "1px solid rgba(239,68,68,0.22)" : "1px solid rgba(168,85,247,0.22)")
                                                : "1px solid transparent",
                                            color: isActive
                                                ? (tab.danger ? "#f87171" : "#c084fc")
                                                : "#6b7280",
                                        }}
                                    >
                                        <Icon size={15} className="shrink-0" />
                                        <span className="hidden md:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Panel de contenido */}
                    <main
                        className="flex-1 rounded-2xl p-5 sm:p-8"
                        style={{
                            background: "rgba(10,11,16,0.98)",
                            border: "1px solid rgba(124,58,237,0.14)",
                            boxShadow: "0 0 40px rgba(109,40,217,0.07), 0 8px 32px rgba(0,0,0,0.6)"
                        }}
                    >
                        {activeTab === "profile"  && <ProfileSection user={user} />}
                        {activeTab === "security" && <SecuritySection />}
                        {activeTab === "delete"   && <DeleteSection user={user} />}
                    </main>
                </div>
            </div>
        </div>
    );
}

// ─── SECCIÓN: PERFIL ──────────────────────────────────────────────────────────
function ProfileSection({ user }) {
    const { updateUser } = useAuth();
    const [form, setForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
        biography: user?.biography || "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");
        try {
            if (form.email !== user?.email) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                    setError("Correo electrónico inválido"); return;
                }
            }
            if (form.username !== user?.username) {
                if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
                    setError("Nombre de usuario inválido"); return;
                }
            }
            const formData = new FormData();
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("biography", form.biography);
            if (avatarFile) formData.append("avatar", avatarFile);

            const { datos } = await api.put("/user/me", formData, { headers: { "Content-Type": undefined } });
            updateUser(datos);
            setSaved(true);
            setAvatarFile(null);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.mensaje || "Error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-7">
            <SectionHeader title="Perfil público" subtitle="Así te verán los demás usuarios de Cinesfera" />

            {/* Avatar */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div
                        className="w-20 h-20 rounded-full overflow-hidden"
                        style={{
                            border: "2px solid rgba(168,85,247,0.4)",
                            background: "rgba(124,58,237,0.15)"
                        }}
                    >
                        {(avatarPreview || user?.avatar) ? (
                            <img src={avatarPreview || user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-purple-400">
                                    {(user?.username || "U")[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea)", border: "2px solid #060810" }}
                    >
                        <Camera size={12} color="white" />
                    </button>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <div>
                    <p className="text-sm font-semibold text-white">{user?.username}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>JPG, PNG o WEBP · Máx. 2MB</p>
                </div>
            </div>

            {/* Campos */}
            <div className="flex flex-col gap-4">
                <Field label="Nombre de usuario" name="username" value={form.username} onChange={handleChange} placeholder="Tu nombre en Cinesfera" />
                <Field label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
                <Field label="Biografía" name="biography" value={form.biography} onChange={handleChange} placeholder="Cuéntanos algo sobre ti..." multiline />
            </div>

            {error && <ErrorBox message={error} />}

            <div className="flex items-center gap-4 pt-2 flex-wrap">
                <SaveButton onClick={handleSave} label={loading ? "Guardando..." : "Guardar cambios"} disabled={loading} />
                {saved && <SuccessMsg text="Cambios guardados" />}
            </div>
        </div>
    );
}

// ─── SECCIÓN: SEGURIDAD ───────────────────────────────────────────────────────
function SecuritySection() {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };
    const toggleShow = (field) => setShow({ ...show, [field]: !show[field] });

    const handleSave = async () => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError("Rellena todos los campos."); return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError("Las contraseñas nuevas no coinciden."); return;
        }
        if (form.newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres."); return;
        }
        setLoading(true);
        setError("");
        try {
            await api.put("/user/me/password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
            setSaved(true);
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.mensaje || "Error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-7">
            <SectionHeader title="Cambiar contraseña" subtitle="Usa una contraseña segura que no uses en ningún otro sitio" />
            <div className="flex flex-col gap-4">
                <PasswordField label="Contraseña actual"          name="currentPassword" value={form.currentPassword} onChange={handleChange} visible={show.current} onToggle={() => toggleShow("current")} />
                <PasswordField label="Nueva contraseña"           name="newPassword"     value={form.newPassword}     onChange={handleChange} visible={show.new}     onToggle={() => toggleShow("new")} />
                <PasswordField label="Confirmar nueva contraseña" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} visible={show.confirm} onToggle={() => toggleShow("confirm")} />
            </div>
            {error && <ErrorBox message={error} />}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
                <SaveButton onClick={handleSave} label={loading ? "Actualizando..." : "Actualizar contraseña"} disabled={loading} />
                {saved && <SuccessMsg text="Contraseña actualizada" />}
            </div>
        </div>
    );
}

// ─── SECCIÓN: ELIMINAR CUENTA ─────────────────────────────────────────────────
function DeleteSection({ user }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [confirmText, setConfirmText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const isMatch = confirmText === user?.username;

    const handleDelete = async () => {
        setLoading(true);
        setError("");
        try {
            await api.delete("/user/me");
            logout();
            navigate("/login");
        } catch (err) {
            setError(err.mensaje || "Error al eliminar la cuenta.");
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-7">
                <SectionHeader title="Eliminar cuenta" subtitle="Esta acción es permanente e irreversible" danger />

                <div className="rounded-xl px-4 py-4 flex gap-3"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                    <AlertTriangle size={17} style={{ color: "#f87171", flexShrink: 0, marginTop: "2px" }} />
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold" style={{ color: "#f87171" }}>Se eliminarán permanentemente:</p>
                        <ul className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                            <li>· Tu perfil y datos personales</li>
                            <li>· Tu historial y lista de favoritos</li>
                            <li>· Tus conexiones con amigos</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                        Escribe <span style={{ color: "#f87171" }}>{user?.username}</span> para confirmar
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={user?.username}
                        style={{
                            ...inputBase,
                            borderColor: isMatch ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.08)"
                        }}
                        onFocus={onFocus}
                        onBlur={(e) => {
                            e.target.style.boxShadow = "none";
                            e.target.style.borderColor = isMatch ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.08)";
                        }}
                    />
                </div>

                {error && <ErrorBox message={error} />}

                <button
                    disabled={!isMatch}
                    onClick={() => setShowModal(true)}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                        background: isMatch ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                        border: isMatch ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(255,255,255,0.06)",
                        color: isMatch ? "#f87171" : "#4b5563",
                        cursor: isMatch ? "pointer" : "not-allowed",
                    }}
                >
                    Eliminar mi cuenta
                </button>
            </div>

            {/* Modal confirmación — sheet en móvil */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
                    style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
                    onClick={() => !loading && setShowModal(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl p-6 sm:p-7 flex flex-col gap-5"
                        style={{
                            background: "rgba(12,13,18,0.98)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            boxShadow: "0 0 60px rgba(239,68,68,0.08)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-white">¿Estás seguro?</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                                Esta acción no se puede deshacer. Tu cuenta y todos tus datos desaparecerán para siempre.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors duration-150"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                                style={{
                                    background: "rgba(239,68,68,0.15)",
                                    border: "1px solid rgba(239,68,68,0.35)",
                                    color: "#f87171",
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? "not-allowed" : "pointer"
                                }}
                            >
                                {loading ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────
function SectionHeader({ title, subtitle, danger }) {
    return (
        <div className="flex flex-col gap-1 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 className="text-base font-semibold" style={{ color: danger ? "#f87171" : "white" }}>{title}</h2>
            <p className="text-xs" style={{ color: "#4b5563" }}>{subtitle}</p>
        </div>
    );
}

function Field({ label, name, value, onChange, placeholder, type = "text", multiline = false }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>{label}</label>
            {multiline ? (
                <textarea
                    name={name} value={value} onChange={onChange} placeholder={placeholder}
                    rows={3} style={{ ...inputBase, resize: "none" }}
                    onFocus={onFocus} onBlur={onBlur}
                />
            ) : (
                <input
                    type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                    style={inputBase} onFocus={onFocus} onBlur={onBlur}
                />
            )}
        </div>
    );
}

function PasswordField({ label, name, value, onChange, visible, onToggle }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>{label}</label>
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    name={name} value={value} onChange={onChange}
                    placeholder="••••••••"
                    style={{ ...inputBase, paddingRight: "40px" }}
                    onFocus={onFocus} onBlur={onBlur}
                />
                <button
                    type="button" onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
                >
                    {visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
}

function SaveButton({ onClick, label = "Guardar cambios", disabled = false }) {
    return (
        <button
            onClick={onClick} disabled={disabled}
            className="py-2.5 px-6 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
                background: disabled ? "rgba(109,40,217,0.25)" : "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                boxShadow: disabled ? "none" : "0 0 20px rgba(109,40,217,0.38)",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
            }}
        >
            {label}
        </button>
    );
}

function ErrorBox({ message }) {
    return (
        <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}>
            {message}
        </div>
    );
}

function SuccessMsg({ text }) {
    return (
        <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
            <CheckCircle size={14} />
            <span>{text}</span>
        </div>
    );
}
