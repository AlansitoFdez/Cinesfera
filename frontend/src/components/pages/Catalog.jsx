import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import useCatalog from "../../hooks/useCatalog";
import MovieCard from "../ui/MovieCard";

const GENRES_MOVIE = [
    { id: 28, name: "Acción" },
    { id: 35, name: "Comedia" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Terror" },
    { id: 16, name: "Animación" },
    { id: 878, name: "Ciencia ficción" },
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
    const navigate = useNavigate();
    const { results, loading, query, setQuery, genreId, setGenreId } = useCatalog(type);
    const gridRef = useRef(null);

    const genres = type === "movie" ? GENRES_MOVIE : GENRES_TV;
    const title = type === "movie" ? "Películas" : "Series";

    // Scroll al top al montar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Animación cuando llegan resultados
    useEffect(() => {
        if (!loading && gridRef.current) {
            const cards = gridRef.current.querySelectorAll(".catalog-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.03 }
            );
        }
    }, [loading, results]);

    const handleGenre = (id) => {
        setGenreId(genreId === id ? null : id);
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-8 md:px-16" style={{ background: "#0d1117" }}>

            {/* ── Título ── */}
            <h1
                className="text-4xl font-black text-white mb-8 uppercase tracking-widest"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                {title}
            </h1>

            {/* ── Buscador ── */}
            <div className="relative mb-6" style={{ maxWidth: "500px" }}>
                <span
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#6b7280", fontSize: "1rem" }}
                >
                    🔍
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Buscar ${title.toLowerCase()}...`}
                    style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(168,85,247,0.2)",
                        borderRadius: "14px",
                        color: "#fff",
                        padding: "12px 16px 12px 44px",
                        fontSize: "0.95rem",
                        outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(168,85,247,0.2)"}
                />
            </div>

            {/* ── Filtros de género ── */}
            <div className="flex gap-2 flex-wrap mb-10">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => handleGenre(genre.id)}
                        style={{
                            background: genreId === genre.id
                                ? "rgba(124,58,237,0.7)"
                                : "rgba(255,255,255,0.04)",
                            border: `1px solid ${genreId === genre.id
                                ? "rgba(168,85,247,0.6)"
                                : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "999px",
                            color: genreId === genre.id ? "#fff" : "#9ca3af",
                            padding: "6px 18px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {
                            if (genreId !== genre.id) {
                                e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)";
                                e.currentTarget.style.color = "#fff";
                            }
                        }}
                        onMouseLeave={e => {
                            if (genreId !== genre.id) {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = "#9ca3af";
                            }
                        }}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {/* ── Grid ── */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>
                        Cargando...
                    </p>
                </div>
            ) : results?.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <p style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                        No se encontraron resultados.
                    </p>
                </div>
            ) : (
                <div
                    ref={gridRef}
                    className="grid gap-4"
                    style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))"
                    }}
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
