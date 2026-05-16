import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Lock, Globe, Trash2, Pencil, X } from "lucide-react";
import { gsap } from "gsap";
import { useLists } from "../../hooks/useLists";

const MAX_LISTS = 10;

const inputStyle = {
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

const handleFocus = e => {
    e.target.style.borderColor = "rgba(124,58,237,0.45)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(124,58,237,0.08)";
};
const handleBlur = e => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow   = "none";
};

// ─── MODAL CREAR / EDITAR ─────────────────────────────────────────────────────
function ListModal({ initial, onConfirm, onClose }) {
    const isEditing = !!initial;
    const [form, setForm] = useState({
        name:        initial?.name        || "",
        description: initial?.description || "",
        is_public:   initial?.is_public   ?? true,
    });
    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
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
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-6 sm:p-8 w-full max-w-md flex flex-col gap-5"
                style={{
                    background: "rgba(10,11,16,0.98)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    boxShadow: "0 0 80px rgba(109,40,217,0.14), 0 0 0 1px rgba(255,255,255,0.03)"
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-[3px] h-5 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h2 className="text-white font-semibold text-base">
                            {isEditing ? "Editar lista" : "Nueva lista"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors duration-150"
                        style={{ color: "#4b5563" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#9ca3af"}
                        onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Nombre */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                        Nombre
                    </label>
                    <input
                        type="text"
                        maxLength={100}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Mis thrillers favoritos..."
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
                        Descripción{" "}
                        <span style={{ color: "#374151", textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
                    </label>
                    <textarea
                        maxLength={255}
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Una breve descripción..."
                        style={{ ...inputStyle, resize: "none" }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>

                {/* Toggle visibilidad */}
                {!initial?.is_default && (
                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                            {form.is_public
                                ? <Globe size={14} style={{ color: "#a855f7" }} />
                                : <Lock  size={14} style={{ color: "#6b7280" }} />
                            }
                            <span className="text-sm" style={{ color: "#9ca3af" }}>
                                {form.is_public ? "Lista pública" : "Lista privada"}
                            </span>
                        </div>
                        <button
                            onClick={() => setForm({ ...form, is_public: !form.is_public })}
                            className="rounded-full transition-all duration-200"
                            style={{
                                width: "40px", height: "22px",
                                background: form.is_public ? "linear-gradient(135deg, #6d28d9, #9333ea)" : "rgba(255,255,255,0.08)",
                                position: "relative", flexShrink: 0,
                                boxShadow: form.is_public ? "0 0 10px rgba(109,40,217,0.4)" : "none"
                            }}
                        >
                            <span style={{
                                position: "absolute",
                                top: "3px",
                                left: form.is_public ? "19px" : "3px",
                                width: "16px", height: "16px",
                                borderRadius: "50%",
                                background: "white",
                                transition: "left 0.2s"
                            }} />
                        </button>
                    </div>
                )}

                {error && (
                    <p className="text-sm rounded-xl px-4 py-3"
                        style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.18)" }}>
                        {error}
                    </p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                        background:  loading ? "rgba(109,40,217,0.3)" : "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                        boxShadow:   loading ? "none" : "0 0 24px rgba(109,40,217,0.35)",
                        cursor:      loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading && (
                        <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: "rgba(255,255,255,0.4) rgba(255,255,255,0.4) rgba(255,255,255,0.4) transparent" }} />
                    )}
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
            className="rounded-xl p-4 sm:p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)";
            }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold truncate">{list.name}</span>
                        {list.is_default && (
                            <span
                                className="text-[9px] rounded-full px-2 py-0.5 font-bold uppercase tracking-wider shrink-0"
                                style={{ background: "rgba(109,40,217,0.18)", color: "#c084fc", border: "1px solid rgba(124,58,237,0.28)" }}
                            >
                                Favoritos
                            </span>
                        )}
                    </div>
                    {list.description && (
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "#6b7280" }}>
                            {list.description}
                        </p>
                    )}
                </div>

                {!list.is_default && (
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(list)}
                            className="p-2 rounded-lg transition-colors duration-150"
                            style={{ color: "#374151" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                            onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(list)}
                            className="p-2 rounded-lg transition-colors duration-150"
                            style={{ color: "#374151" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                            onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: "#374151" }}>
                    {list.item_count} {list.item_count === 1 ? "título" : "títulos"}
                </span>
                <div className="flex items-center gap-1.5">
                    {list.is_public
                        ? <Globe size={11} style={{ color: "#4b5563" }} />
                        : <Lock  size={11} style={{ color: "#4b5563" }} />
                    }
                    <span className="text-[11px]" style={{ color: "#4b5563" }}>
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5"
                style={{
                    background: "rgba(10,11,16,0.98)",
                    border: "1px solid rgba(239,68,68,0.18)",
                    boxShadow: "0 0 60px rgba(239,68,68,0.08), 0 0 0 1px rgba(255,255,255,0.03)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col gap-2">
                    <h2 className="text-white font-semibold">Borrar lista</h2>
                    <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                        ¿Seguro que quieres borrar{" "}
                        <span className="text-white font-semibold">"{listName}"</span>?
                        Esta acción no se puede deshacer.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150"
                        style={{ background: "rgba(239,68,68,0.7)", border: "1px solid rgba(239,68,68,0.3)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.88)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.7)"}
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
    const [editTarget,  setEditTarget]  = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const headerRef = useRef(null);
    const gridRef   = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 22, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
        );
    }, []);

    useEffect(() => {
        if (loading || !gridRef.current) return;
        const cards = [...gridRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" }
        );
    }, [loading, lists]);

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
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060810" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Error al cargar las listas.</p>
        </div>
    );

    const canCreate = lists.length < MAX_LISTS;

    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-24 pb-24 pt-28" style={{ background: "#060810" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div ref={headerRef} className="flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-[3px] h-7 rounded-full shrink-0"
                                style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Mis listas</h1>
                        </div>
                        <p className="text-xs pl-6 font-medium" style={{ color: "#374151" }}>
                            {lists.length} / {MAX_LISTS}
                        </p>
                    </div>

                    <button
                        onClick={() => canCreate && setCreateModal(true)}
                        disabled={!canCreate}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        style={canCreate
                            ? { background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)", color: "white", boxShadow: "0 0 20px rgba(109,40,217,0.38)" }
                            : { background: "rgba(255,255,255,0.04)", color: "#374151", cursor: "not-allowed" }
                        }
                        title={!canCreate ? `Límite de ${MAX_LISTS} listas alcanzado` : ""}
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">Nueva lista</span>
                        <span className="sm:hidden">Nueva</span>
                    </button>
                </div>

                {/* Divisor */}
                <div className="h-px -mt-2" style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.12) 30%, rgba(124,58,237,0.12) 70%, transparent)" }} />

                {/* Grid / empty state */}
                {lists.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        <p className="text-sm" style={{ color: "#374151" }}>Aún no tienes listas</p>
                        <button
                            onClick={() => setCreateModal(true)}
                            className="text-sm transition-colors duration-150"
                            style={{ color: "#7c3aed" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#a855f7"}
                            onMouseLeave={e => e.currentTarget.style.color = "#7c3aed"}
                        >
                            Crea tu primera lista →
                        </button>
                    </div>
                ) : (
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            {createModal && <ListModal onConfirm={createList} onClose={() => setCreateModal(false)} />}
            {editTarget && (
                <ListModal
                    initial={editTarget}
                    onConfirm={data => updateList(editTarget.id, data)}
                    onClose={() => setEditTarget(null)}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    listName={deleteTarget.name}
                    onConfirm={async () => { await deleteList(deleteTarget.id); setDeleteTarget(null); }}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
