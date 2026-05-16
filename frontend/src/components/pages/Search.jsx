import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { gsap } from "gsap"
import useSearch from "../../hooks/useSearch"
import MovieCard from "../ui/MovieCard"

export default function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query") || ""
    const { results, loading, error } = useSearch(query)
    const gridRef   = useRef(null)
    const headerRef = useRef(null)

    useEffect(() => {
        if (!headerRef.current) return
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 18, filter: "blur(4px)" },
            { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.6, ease: "power3.out" }
        )
    }, [query])

    useEffect(() => {
        if (loading || !gridRef.current) return
        const cards = [...gridRef.current.children]
        if (!cards.length) return
        gsap.fromTo(cards,
            { opacity: 0, y: 18, scale: 0.96 },
            { opacity: 1, y: 0,  scale: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" }
        )
    }, [loading, results])

    return (
        <div className="min-h-screen pb-24 pt-28" style={{ background: "#060810" }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-8">

                {/* Header */}
                <div ref={headerRef} className="mb-10 relative">
                    <div className="absolute -top-6 -left-4 w-48 h-48 pointer-events-none" style={{
                        background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)",
                        borderRadius: "50%"
                    }} />
                    <div className="flex items-end gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-[3px] h-7 rounded-full shrink-0"
                                style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Búsqueda
                            </h1>
                        </div>
                        {!loading && query && (
                            <span className="mb-1 text-xs font-medium" style={{ color: "#374151" }}>
                                {results.length} resultado{results.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    {!loading && query && (
                        <p className="text-sm pl-6 mt-1" style={{ color: "#4b5563" }}>
                            para <span className="font-semibold" style={{ color: "#9ca3af" }}>"{query}"</span>
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center gap-6 py-28">
                        <div className="relative w-11 h-11">
                            <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(124,58,237,0.15)" }} />
                            <div className="absolute inset-0 rounded-full animate-spin" style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
                            <div className="absolute inset-2 rounded-full animate-spin" style={{ borderTop: "1.5px solid rgba(168,85,247,0.4)", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent", animationDuration: "1.5s", animationDirection: "reverse" }} />
                        </div>
                        <p className="uppercase tracking-[0.3em] text-[10px]" style={{ color: "#374151" }}>Buscando</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center gap-4 py-28">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(248,113,113,0.35)" strokeWidth="1.2">
                            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                        </svg>
                        <p className="text-sm" style={{ color: "#f87171" }}>Error al cargar los resultados.</p>
                    </div>
                )}

                {/* Sin resultados */}
                {!loading && !error && results.length === 0 && query && (
                    <div className="flex flex-col items-center gap-4 py-28">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <p className="text-sm" style={{ color: "#374151" }}>
                            Sin resultados para "{query}"
                        </p>
                    </div>
                )}

                {/* Grid */}
                {!loading && results.length > 0 && (
                    <div
                        ref={gridRef}
                        className="grid gap-3 sm:gap-4"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
                    >
                        {results.map(movie => (
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
