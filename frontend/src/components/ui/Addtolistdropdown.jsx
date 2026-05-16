import { useState, useRef, useEffect } from "react";
import { ListPlus, Check, ChevronDown } from "lucide-react";
import { useListsDropdown } from "../../hooks/useLists";

export default function AddToListDropdown({ tmdb_id, media_type, title, poster_path, vote_average }) {
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const dropdownRef = useRef(null);

    const { lists, loading, toggle } = useListsDropdown(tmdb_id, media_type);

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
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                    background: open ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
                    border: `1px solid ${open ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.25)"}`,
                    color: "#c084fc"
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(124,58,237,0.18)"
                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.background = "rgba(124,58,237,0.1)"
                        e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)"
                    }
                }}
            >
                <ListPlus size={15} />
                Añadir a lista
                <ChevronDown
                    size={13}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                    }}
                />
            </button>

            {/* Panel dropdown */}
            {open && (
                <div
                    className="absolute left-0 top-full mt-2 rounded-xl overflow-hidden z-50"
                    style={{
                        minWidth: "210px",
                        background: "rgba(12,13,18,0.98)",
                        border: "1px solid rgba(168,85,247,0.18)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,85,247,0.05)"
                    }}
                >
                    {/* Feedback */}
                    {feedback && (
                        <div
                            className="px-4 py-2.5 text-xs text-center font-medium"
                            style={{
                                background: feedback.action === "added"
                                    ? "rgba(74,222,128,0.08)"
                                    : "rgba(239,68,68,0.08)",
                                color: feedback.action === "added" ? "#4ade80" : "#f87171",
                                borderBottom: "1px solid rgba(168,85,247,0.08)"
                            }}
                        >
                            {feedback.action === "added"
                                ? `✓ Añadido a ${feedback.listName}`
                                : `Eliminado de ${feedback.listName}`
                            }
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-4">
                            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
                            <p className="text-xs" style={{ color: "#4b5563" }}>Cargando...</p>
                        </div>
                    ) : lists.length === 0 ? (
                        <p className="px-4 py-4 text-xs text-center" style={{ color: "#4b5563" }}>
                            No tienes listas todavía
                        </p>
                    ) : (
                        <ul className="py-1">
                            {lists.map((list) => (
                                <li key={list.id}>
                                    <button
                                        onClick={() => handleToggle(list)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150"
                                        style={{ color: list.contains ? "#c084fc" : "#9ca3af" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(168,85,247,0.08)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span className="truncate pr-3">{list.name}</span>
                                        {list.contains && (
                                            <Check size={13} style={{ color: "#a855f7", flexShrink: 0 }} />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
