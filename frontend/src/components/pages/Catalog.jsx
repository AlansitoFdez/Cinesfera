import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Search } from "lucide-react";
import useCatalog from "../../hooks/useCatalog";
import MovieCard from "../ui/MovieCard";

const GENRES_MOVIE = [
    { id: 28, name: "Acción" },
    { id: 35, name: "Comedia" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Terror" },
    { id: 16, name: "Animación" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
    { id: 10749, name: "Romance" },
];

const GENRES_TV = [
    { id: 10759, name: "Acción" },
    { id: 35, name: "Comedia" },
    { id: 18, name: "Drama" },
    { id: 9648, name: "Misterio" },
    { id: 16, name: "Animación" },
    { id: 10765, name: "Sci-Fi" },
    { id: 80, name: "Crimen" },
    { id: 10766, name: "Telenovela" },
];

export default function Catalog({ type }) {
    const { results, loading, query, setQuery, genreId, setGenreId } = useCatalog(type);
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    const genres = type === "movie" ? GENRES_MOVIE : GENRES_TV;
    const title = type === "movie" ? "Películas" : "Series";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Entrada del header al montar
    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    // Stagger en las cards al cargar resultados
    useEffect(() => {
        if (loading || !gridRef.current) return;
        const cards = [...gridRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(
            cards,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.025 }
        );
    }, [loading, results]);

    const handleGenre = (id) => {
        setGenreId(genreId === id ? null : id);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-14" style={{ background: "#0d1117" }}>

            {/* ── Header ─────────────────────────────────── */}
            <div ref={headerRef} className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-[3px] h-7 rounded-full shrink-0"
                        style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }}
                    />
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                </div>
                <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                    {loading
                        ? "Cargando..."
                        : `${results?.length ?? 0} resultado${results?.length !== 1 ? "s" : ""}`
                    }
                </p>
            </div>

            {/* ── Buscador ───────────────────────────────── */}
            <div className="relative mb-6" style={{ maxWidth: "480px" }}>
                <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#6b7280" }}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Buscar ${title.toLowerCase()}...`}
                    style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(168,85,247,0.18)",
                        borderRadius: "12px",
                        color: "#fff",
                        padding: "11px 16px 11px 42px",
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(168,85,247,0.18)"}
                />
            </div>

            {/* ── Filtros de género ──────────────────────── */}
            <div className="flex gap-2 flex-wrap mb-10">
                {genres.map((genre) => {
                    const active = genreId === genre.id;
                    return (
                        <button
                            key={genre.id}
                            onClick={() => handleGenre(genre.id)}
                            style={{
                                background: active ? "rgba(124,58,237,0.65)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${active ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.07)"}`,
                                borderRadius: "999px",
                                color: active ? "#fff" : "#9ca3af",
                                padding: "5px 16px",
                                fontSize: "0.82rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                boxShadow: active ? "0 0 14px rgba(124,58,237,0.28)" : "none"
                            }}
                            onMouseEnter={e => {
                                if (!active) {
                                    e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
                                    e.currentTarget.style.color = "#e5e7eb";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                    e.currentTarget.style.color = "#9ca3af";
                                }
                            }}
                        >
                            {genre.name}
                        </button>
                    );
                })}
            </div>

            {/* ── Contenido ─────────────────────────────── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center gap-5 py-24">
                    <div
                        className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }}
                    />
                    <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>
                        Cargando
                    </p>
                </div>
            ) : results?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24">
                    <span style={{ fontSize: "2.5rem", opacity: 0.25 }}>🎬</span>
                    <p className="text-sm" style={{ color: "#4b5563" }}>
                        No se encontraron resultados
                        {query ? ` para "${query}"` : ""}.
                    </p>
                </div>
            ) : (
                <div
                    ref={gridRef}
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}
                >
                    {results.map((item) => (
                        <MovieCard
                            key={item.id}
                            movie={item}
                            mediaType={type}
                            className="w-full"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
