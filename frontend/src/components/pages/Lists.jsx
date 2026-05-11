import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Lock, Globe, Trash2, Pencil, X, Check } from "lucide-react";
import { useLists } from "../../hooks/useLists";

const MAX_LISTS = 10;

// ─── MODAL CREAR / EDITAR LISTA ───────────────────────────────────────────────
function ListModal({ initial, onConfirm, onClose }) {
    const isEditing = !!initial;
    const [form, setForm] = useState({
        name: initial?.name || "",
        description: initial?.description || "",
        is_public: initial?.is_public ?? true,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError("El nombre es obligatorio");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await onConfirm(form);
            onClose();
        } catch (err) {
            setError(err.mensaje || "Error al guardar la lista");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
        >
            {/* Panel — stopPropagation para que no cierre al hacer click dentro */}
            <div
                className="rounded-2xl p-8 w-full max-w-md flex flex-col gap-6"
                style={{
                    background: "rgba(15,15,20,0.98)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    boxShadow: "0 0 60px rgba(124,58,237,0.15)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-black uppercase tracking-widest text-lg"
                        style={{ fontFamily: "'Georgia', serif" }}>
                        {isEditing ? "Editar lista" : "Nueva lista"}
                    </h2>
                    <button onClick={onClose} style={{ color: "#6b7280" }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Nombre */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                        Nombre
                    </label>
                    <input
                        type="text"
                        maxLength={100}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Mis thrillers favoritos..."
                        className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                        Descripción (opcional)
                    </label>
                    <textarea
                        maxLength={255}
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Una breve descripción..."
                        className="rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                </div>

                {/* Visibilidad — no se muestra si es la lista por defecto */}
                {!initial?.is_default && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {form.is_public
                                ? <Globe size={15} style={{ color: "#a855f7" }} />
                                : <Lock size={15} style={{ color: "#6b7280" }} />
                            }
                            <span className="text-sm" style={{ color: "#9ca3af" }}>
                                {form.is_public ? "Lista pública" : "Lista privada"}
                            </span>
                        </div>
                        {/* Toggle visibilidad */}
                        <button
                            onClick={() => setForm({ ...form, is_public: !form.is_public })}
                            className="rounded-full transition-all duration-200"
                            style={{
                                width: "42px", height: "24px",
                                background: form.is_public ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)",
                                position: "relative"
                            }}
                        >
                            <span style={{
                                position: "absolute",
                                top: "3px",
                                left: form.is_public ? "20px" : "3px",
                                width: "18px", height: "18px",
                                borderRadius: "50%",
                                background: "white",
                                transition: "left 0.2s"
                            }} />
                        </button>
                    </div>
                )}

                {error && (
                    <p className="text-sm rounded-xl px-4 py-3"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-xl py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: "rgba(124,58,237,0.8)", color: "white" }}
                >
                    {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear lista"}
                </button>
            </div>
        </div>
    );
}

// ─── TARJETA DE LISTA ─────────────────────────────────────────────────────────
function ListCard({ list, onEdit, onDelete, onClick }) {
    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(168,85,247,0.1)"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.1)"}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold truncate">{list.name}</span>
                        {list.is_default && (
                            <span className="text-xs rounded-full px-2 py-0.5 shrink-0"
                                style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                                Por defecto
                            </span>
                        )}
                    </div>
                    {list.description && (
                        <p className="text-xs line-clamp-2" style={{ color: "#6b7280" }}>{list.description}</p>
                    )}
                </div>

                {/* Acciones — solo si no es la lista por defecto */}
                {!list.is_default && (
                    <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(list)}
                            className="p-2 rounded-lg transition-colors duration-150"
                            style={{ color: "#6b7280" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(list)}
                            className="p-2 rounded-lg transition-colors duration-150"
                            style={{ color: "#6b7280" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                            onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest" style={{ color: "#4b5563" }}>
                    {list.item_count} {list.item_count === 1 ? "título" : "títulos"}
                </span>
                <div className="flex items-center gap-1.5">
                    {list.is_public
                        ? <Globe size={12} style={{ color: "#6b7280" }} />
                        : <Lock size={12} style={{ color: "#6b7280" }} />
                    }
                    <span className="text-xs" style={{ color: "#6b7280" }}>
                        {list.is_public ? "Pública" : "Privada"}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── MODAL CONFIRMAR BORRADO ──────────────────────────────────────────────────
function DeleteConfirmModal({ listName, onConfirm, onClose }) {
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
                <div className="flex flex-col gap-2">
                    <h2 className="text-white font-black uppercase tracking-widest"
                        style={{ fontFamily: "'Georgia', serif" }}>
                        Borrar lista
                    </h2>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                        ¿Seguro que quieres borrar <span className="text-white font-semibold">"{listName}"</span>?
                        Esta acción no se puede deshacer.
                    </p>
                </div>
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
                        Borrar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Lists() {
    const navigate = useNavigate();
    const { lists, loading, error, createList, updateList, deleteList } = useLists();

    const [createModal, setCreateModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { window.scrollTo(0, 0) }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando listas...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Error al cargar las listas.</p>
        </div>
    );

    const canCreate = lists.length < MAX_LISTS;

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-widest"
                            style={{ fontFamily: "'Georgia', serif" }}>
                            Mis Listas
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                            {lists.length} / {MAX_LISTS} listas
                        </p>
                    </div>

                    <button
                        onClick={() => canCreate && setCreateModal(true)}
                        disabled={!canCreate}
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all duration-200"
                        style={canCreate
                            ? { background: "rgba(124,58,237,0.8)", color: "white" }
                            : { background: "rgba(255,255,255,0.05)", color: "#4b5563", cursor: "not-allowed" }
                        }
                        title={!canCreate ? `Límite de ${MAX_LISTS} listas alcanzado` : ""}
                    >
                        <Plus size={16} />
                        Nueva lista
                    </button>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: "rgba(168,85,247,0.15)" }} />

                {/* Grid de listas */}
                {lists.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <p className="text-4xl">🎬</p>
                        <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>
                            Aún no tienes listas
                        </p>
                        <button
                            onClick={() => setCreateModal(true)}
                            className="mt-2 text-sm underline"
                            style={{ color: "#a855f7" }}
                        >
                            Crea tu primera lista
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lists.map(list => (
                            <ListCard
                                key={list.id}
                                list={list}
                                onEdit={setEditTarget}
                                onDelete={setDeleteTarget}
                                onClick={() => navigate(`/list/${list.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modales */}
            {createModal && (
                <ListModal
                    onConfirm={createList}
                    onClose={() => setCreateModal(false)}
                />
            )}
            {editTarget && (
                <ListModal
                    initial={editTarget}
                    onConfirm={(data) => updateList(editTarget.id, data)}
                    onClose={() => setEditTarget(null)}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    listName={deleteTarget.name}
                    onConfirm={async () => {
                        await deleteList(deleteTarget.id);
                        setDeleteTarget(null);
                    }}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}