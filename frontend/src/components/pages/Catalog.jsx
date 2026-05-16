import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Search } from "lucide-react";
import useCatalog from "../../hooks/useCatalog";
import MovieCard from "../ui/MovieCard";

const GENRES_MOVIE = [
    { id: 28,    name: "Acción"    },
    { id: 35,    name: "Comedia"   },
    { id: 18,    name: "Drama"     },
    { id: 27,    name: "Terror"    },
    { id: 16,    name: "Animación" },
    { id: 878,   name: "Sci-Fi"    },
    { id: 53,    name: "Thriller"  },
    { id: 10749, name: "Romance"   },
];

const GENRES_TV = [
    { id: 10759, name: "Acción"    },
    { id: 35,    name: "Comedia"   },
    { id: 18,    name: "Drama"     },
    { id: 9648,  name: "Misterio"  },
    { id: 16,    name: "Animación" },
    { id: 10765, name: "Sci-Fi"    },
    { id: 80,    name: "Crimen"    },
    { id: 10766, name: "Telenovela"},
];

export default function Catalog({ type }) {
    const { results, loading, query, setQuery, genreId, setGenreId } = useCatalog(type);
    const headerRef   = useRef(null);
    const controlsRef = useRef(null);
    const gridRef     = useRef(null);

    const genres = type === "movie" ? GENRES_MOVIE : GENRES_TV;
    const title  = type === "movie" ? "Películas" : "Series";

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!headerRef.current || !controlsRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 22, filter: "blur(4px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }
            );
            gsap.fromTo(controlsRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 0.18 }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (loading || !gridRef.current) return;
        const cards = [...gridRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 20, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", stagger: 0.025 }
        );
    }, [loading, results]);

    const handleGenre = (id) => setGenreId(genreId === id ? null : id);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 md:px-14" style={{ background: "#060810" }}>

            {/* ── Header ─────────────────────────────────── */}
            <div ref={headerRef} className="mb-8 relative">
                <div
                    className="absolute -top-8 -left-4 w-56 h-56 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", borderRadius: "50%" }}
                />
                <div className="flex items-end gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-[3px] h-8 rounded-full shrink-0" style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
                    </div>
                    <span className="mb-1 text-xs font-medium" style={{ color: "#374151" }}>
                        {loading ? "—" : `${results?.length ?? 0} títulos`}
                    </span>
                </div>
            </div>

            {/* ── Controles ──────────────────────────────── */}
            <div ref={controlsRef} className="mb-10 flex flex-col gap-4">

                {/* Buscador */}
                <div className="relative" style={{ maxWidth: "440px" }}>
                    <Search
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#4b5563" }}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={`Buscar ${title.toLowerCase()}...`}
                        style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "12px",
                            color: "#fff",
                            padding: "11px 16px 11px 40px",
                            fontSize: "0.88rem",
                            outline: "none",
                            transition: "border-color 0.2s, box-shadow 0.2s"
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = "rgba(124,58,237,0.45)";
                            e.target.style.boxShadow  = "0 0 0 3px rgba(124,58,237,0.08)";
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = "rgba(255,255,255,0.07)";
                            e.target.style.boxShadow  = "none";
                        }}
                    />
                </div>

                {/* Géneros */}
                <div className="flex gap-2 flex-wrap">
                    {genres.map(genre => {
                        const active = genreId === genre.id;
                        return (
                            <button
                                key={genre.id}
                                onClick={() => handleGenre(genre.id)}
                                style={{
                                    background:   active ? "linear-gradient(135deg, #6d28d9, #9333ea)" : "rgba(255,255,255,0.04)",
                                    border:       `1px solid ${active ? "rgba(147,51,234,0.6)" : "rgba(255,255,255,0.08)"}`,
                                    borderRadius: "999px",
                                    color:        active ? "#fff" : "#6b7280",
                                    padding:      "5px 16px",
                                    fontSize:     "0.8rem",
                                    fontWeight:   "600",
                                    cursor:       "pointer",
                                    transition:   "all 0.2s",
                                    boxShadow:    active ? "0 0 16px rgba(109,40,217,0.32)" : "none"
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                                        e.currentTarget.style.color = "#e5e7eb";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "#6b7280";
                                    }
                                }}
                            >
                                {genre.name}
                            </button>
                        );
                    })}
                </div>

                {/* Divisor */}
                <div className="h-px" style={{
                    background: "linear-gradient(to right, rgba(124,58,237,0.1), rgba(255,255,255,0.04) 50%, transparent)"
                }} />
            </div>

            {/* ── Contenido ─────────────────────────────── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center gap-6 py-28">
                    <div className="relative w-11 h-11">
                        <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(124,58,237,0.15)" }} />
                        <div className="absolute inset-0 rounded-full animate-spin" style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
                        <div className="absolute inset-2 rounded-full animate-spin" style={{ borderTop: "1.5px solid rgba(168,85,247,0.4)", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent", animationDuration: "1.5s", animationDirection: "reverse" }} />
                    </div>
                    <p className="uppercase tracking-[0.3em] text-[10px]" style={{ color: "#374151" }}>Cargando</p>
                </div>
            ) : results?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-28">
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-sm" style={{ color: "#374151" }}>
                        Sin resultados{query ? ` para "${query}"` : ""}
                    </p>
                </div>
            ) : (
                <div
                    ref={gridRef}
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
                >
                    {results.map(item => (
                        <MovieCard key={item.id} movie={item} mediaType={type} className="w-full" />
                    ))}
                </div>
            )}
        </div>
    );
}
