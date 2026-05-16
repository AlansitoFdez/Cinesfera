import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { gsap } from "gsap"
import useSearch from "../../hooks/useSearch"
import MovieCard from "../ui/MovieCard"

export default function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query") || ""
    const { results, loading, error } = useSearch(query)
    const gridRef = useRef(null)
    const headerRef = useRef(null)

    // Entrada del header
    useEffect(() => {
        if (!headerRef.current) return
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        )
    }, [query])

    // Stagger de resultados
    useEffect(() => {
        if (loading || !gridRef.current) return
        const cards = [...gridRef.current.children]
        if (!cards.length) return
        gsap.fromTo(
            cards,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }
        )
    }, [loading, results])

    return (
        <div className="min-h-screen pb-24 pt-28" style={{ background: "#0d1117" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-8">

                {/* Header */}
                <div ref={headerRef} className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-[3px] h-7 rounded-full shrink-0"
                            style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Búsqueda
                        </h1>
                    </div>
                    <p className="text-sm pl-6" style={{ color: "#4b5563" }}>
                        {loading
                            ? "Buscando..."
                            : results.length > 0
                                ? `${results.length} resultado${results.length !== 1 ? "s" : ""} para `
                                : `Sin resultados para `
                        }
                        {!loading && query && (
                            <span className="font-semibold" style={{ color: "#9ca3af" }}>"{query}"</span>
                        )}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center gap-5 py-24">
                        <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
                        <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>
                            Buscando
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center gap-4 py-24">
                        <span style={{ fontSize: "2.2rem", opacity: 0.2 }}>⚠️</span>
                        <p className="text-sm" style={{ color: "#f87171" }}>Error al cargar los resultados.</p>
                    </div>
                )}

                {/* Sin resultados */}
                {!loading && !error && results.length === 0 && query && (
                    <div className="flex flex-col items-center gap-4 py-24">
                        <span style={{ fontSize: "2.5rem", opacity: 0.2 }}>🔍</span>
                        <p className="text-sm" style={{ color: "#4b5563" }}>
                            No encontramos nada para "{query}"
                        </p>
                    </div>
                )}

                {/* Grid de resultados */}
                {!loading && results.length > 0 && (
                    <div
                        ref={gridRef}
                        className="grid gap-3 sm:gap-4"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
                    >
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
