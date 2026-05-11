import { useState, useRef, useEffect } from "react";
import { ListPlus, Check, ChevronDown } from "lucide-react";
import { useListsDropdown } from "../../hooks/useLists";

// ─── ADD TO LIST DROPDOWN ─────────────────────────────────────────────────────
// Se coloca en Details.jsx junto al póster.
// Recibe los datos del contenido para poder hacer findOrCreate en el backend.
export default function AddToListDropdown({ tmdb_id, media_type, title, poster_path, vote_average }) {
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState(null); // { listName, action }
    const dropdownRef = useRef(null);

    const { lists, loading, toggle } = useListsDropdown(tmdb_id, media_type);

    // Cierra el dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = async (list) => {
        try {
            const action = await toggle(list.id, { tmdb_id, media_type, title, poster_path, vote_average });
            // Feedback visual breve sin cerrar el dropdown
            setFeedback({ listName: list.name, action });
            setTimeout(() => setFeedback(null), 2000);
        } catch {
            // Silencioso — el tick no cambia si falla
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón principal */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all duration-200"
                style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    color: "#c084fc",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            >
                <ListPlus size={16} />
                Añadir a lista
                <ChevronDown
                    size={14}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                    }}
                />
            </button>

            {/* Panel dropdown */}
            {open && (
                <div
                    className="absolute left-0 top-full mt-2 rounded-2xl overflow-hidden z-50"
                    style={{
                        minWidth: "220px",
                        background: "rgba(15,15,20,0.98)",
                        border: "1px solid rgba(168,85,247,0.2)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
                    }}
                >
                    {/* Feedback breve */}
                    {feedback && (
                        <div
                            className="px-4 py-2 text-xs uppercase tracking-widest text-center"
                            style={{
                                background: feedback.action === "added"
                                    ? "rgba(74,222,128,0.1)"
                                    : "rgba(239,68,68,0.1)",
                                color: feedback.action === "added" ? "#4ade80" : "#f87171",
                                borderBottom: "1px solid rgba(168,85,247,0.1)"
                            }}
                        >
                            {feedback.action === "added"
                                ? `✓ Añadido a ${feedback.listName}`
                                : `Eliminado de ${feedback.listName}`
                            }
                        </div>
                    )}

                    {loading ? (
                        <p className="px-4 py-4 text-xs uppercase tracking-widest text-center"
                            style={{ color: "#6b7280" }}>
                            Cargando listas...
                        </p>
                    ) : lists.length === 0 ? (
                        <p className="px-4 py-4 text-xs uppercase tracking-widest text-center"
                            style={{ color: "#6b7280" }}>
                            No tienes listas todavía
                        </p>
                    ) : (
                        <ul>
                            {lists.map((list, i) => (
                                <li key={list.id}>
                                    <button
                                        onClick={() => handleToggle(list)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150"
                                        style={{ color: list.contains ? "#c084fc" : "#d1d5db" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(168,85,247,0.08)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span className="truncate pr-3">{list.name}</span>
                                        {list.contains && (
                                            <Check size={14} style={{ color: "#a855f7", flexShrink: 0 }} />
                                        )}
                                    </button>
                                    {/* Separador entre items, no después del último */}
                                    {i < lists.length - 1 && (
                                        <div style={{ height: "1px", background: "rgba(168,85,247,0.07)" }} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}