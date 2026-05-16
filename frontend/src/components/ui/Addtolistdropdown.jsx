import { useState, useRef, useEffect } from "react";
import { ListPlus, Check, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useListsDropdown } from "../../hooks/useLists";

export default function AddToListDropdown({ tmdb_id, media_type, title, poster_path, vote_average }) {
    const [open,     setOpen]     = useState(false);
    const [feedback, setFeedback] = useState(null);
    const dropdownRef = useRef(null);
    const panelRef    = useRef(null);

    const { lists, loading, toggle } = useListsDropdown(tmdb_id, media_type);

    // Cerrar al clicar fuera
    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animación de entrada del panel
    useEffect(() => {
        if (open && panelRef.current) {
            gsap.fromTo(panelRef.current,
                { opacity: 0, scaleY: 0.88, y: -6 },
                { opacity: 1, scaleY: 1,    y: 0, duration: 0.22, ease: "power2.out", transformOrigin: "top center" }
            );
        }
    }, [open]);

    const handleToggle = async (list) => {
        try {
            const action = await toggle(list.id, { tmdb_id, media_type, title, poster_path, vote_average });
            setFeedback({ listName: list.name, action });
            setTimeout(() => setFeedback(null), 2000);
        } catch {
            // Silencioso
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Botón principal */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                    background:  open ? "rgba(109,40,217,0.22)" : "rgba(109,40,217,0.1)",
                    border:      `1px solid ${open ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.25)"}`,
                    color:       "#c084fc",
                    boxShadow:   open ? "0 0 18px rgba(109,40,217,0.2)" : "none"
                }}
                onMouseEnter={e => {
                    if (!open) {
                        e.currentTarget.style.background   = "rgba(109,40,217,0.18)";
                        e.currentTarget.style.borderColor  = "rgba(124,58,237,0.45)";
                    }
                }}
                onMouseLeave={e => {
                    if (!open) {
                        e.currentTarget.style.background   = "rgba(109,40,217,0.1)";
                        e.currentTarget.style.borderColor  = "rgba(124,58,237,0.25)";
                    }
                }}
            >
                <ListPlus size={15} />
                Añadir a lista
                <ChevronDown
                    size={13}
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                />
            </button>

            {/* Panel */}
            {open && (
                <div
                    ref={panelRef}
                    className="absolute left-0 top-full mt-2 rounded-xl overflow-hidden z-50"
                    style={{
                        minWidth:  "220px",
                        background: "rgba(10,11,16,0.98)",
                        border:     "1px solid rgba(124,58,237,0.2)",
                        boxShadow:  "0 16px 48px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03)"
                    }}
                >
                    {/* Feedback */}
                    {feedback && (
                        <div
                            className="px-4 py-2.5 text-xs text-center font-semibold"
                            style={{
                                background:   feedback.action === "added" ? "rgba(34,197,94,0.08)"  : "rgba(239,68,68,0.08)",
                                color:        feedback.action === "added" ? "#4ade80" : "#f87171",
                                borderBottom: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            {feedback.action === "added"
                                ? `Añadido a ${feedback.listName}`
                                : `Eliminado de ${feedback.listName}`
                            }
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-4">
                            <div className="w-3.5 h-3.5 rounded-full animate-spin"
                                style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
                            <p className="text-xs" style={{ color: "#374151" }}>Cargando</p>
                        </div>
                    ) : lists.length === 0 ? (
                        <p className="px-4 py-4 text-xs text-center" style={{ color: "#374151" }}>
                            No tienes listas todavía
                        </p>
                    ) : (
                        <ul className="py-1">
                            {lists.map(list => (
                                <li key={list.id}>
                                    <button
                                        onClick={() => handleToggle(list)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150"
                                        style={{ color: list.contains ? "#c084fc" : "#6b7280" }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "rgba(109,40,217,0.1)";
                                            if (!list.contains) e.currentTarget.style.color = "#e5e7eb";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "transparent";
                                            if (!list.contains) e.currentTarget.style.color = "#6b7280";
                                        }}
                                    >
                                        <span className="truncate pr-3 text-left">{list.name}</span>
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
