import { useSearchParams } from "react-router-dom"
import useSearch from "../../hooks/useSearch"
import MovieCard from "../ui/MovieCard"

export default function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")
    const { results, loading, error } = useSearch(query)

    return (
        <div className="min-h-screen" style={{ background: "#0d1117" }}>
            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-16">
                <h1
                    className="text-2xl font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    Resultados de <span style={{ color: "#a855f7" }}>búsqueda</span>
                </h1>
                <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#6b7280" }}>
                    Mostrando resultados para "{query}"
                </p>

                {loading && <p className="text-sm mt-8" style={{ color: "#6b7280" }}>Cargando...</p>}
                {!loading && error && <p className="text-sm mt-8" style={{ color: "#f87171" }}>Error al cargar resultados.</p>}
                {!loading && results.length === 0 && <p className="text-sm mt-8" style={{ color: "#6b7280" }}>No se encontraron resultados.</p>}

                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                        {results.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                mediaType={movie.media_type}
                                className="w-full"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}