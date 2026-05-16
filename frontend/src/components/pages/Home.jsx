import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useHomeData from '../../hooks/useHomeData'
import CarouselSection from '../ui/CarouselHome'

export default function Home() {
    const navigate = useNavigate()
    const heroImgRef = useRef(null)
    const heroContentRef = useRef(null)

    const {
        trending,
        popular_movies,
        popular_series,
        top_rated_movies,
        top_rated_series,
        top_comedy_series,
        top_action_movies,
        top_horror_movies,
        loading,
        error
    } = useHomeData()

    useEffect(() => {
        if (!trending.length || !heroContentRef.current || !heroImgRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(heroImgRef.current,
                { scale: 1.08 },
                { scale: 1, duration: 6, ease: 'power1.out' }
            )
            gsap.fromTo(
                [...heroContentRef.current.children],
                { y: 36, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.85, stagger: 0.13, ease: 'power3.out', delay: 0.25 }
            )
        })

        return () => ctx.revert()
    }, [trending])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
                <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }} />
                <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
            </div>
        )
    }

    if (error || !trending.length) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
                <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Error al cargar el contenido.</p>
            </div>
        )
    }

    const hero = trending[0]
    const heroRating = hero.vote_average?.toFixed(1)
    const heroType = hero.media_type === 'movie' ? 'Película' : 'Serie'

    return (
        <div className="min-h-screen" style={{ background: "#0d1117" }}>

            {/* ── Hero ─────────────────────────────────────── */}
            <div className="relative w-full overflow-hidden" style={{ height: '100svh' }}>

                {/* Backdrop con Ken Burns */}
                <img
                    ref={heroImgRef}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
                    alt={hero.title || hero.name}
                />

                {/* Grano cinematográfico */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
                        opacity: 0.55,
                        mixBlendMode: 'overlay'
                    }}
                />

                {/* Degradados */}
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(105deg, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.55) 45%, rgba(13,17,23,0.1) 70%, transparent 100%)"
                }} />
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, #0d1117 0%, rgba(13,17,23,0.6) 30%, transparent 60%)"
                }} />

                {/* Contenido del hero — responsive */}
                <div
                    ref={heroContentRef}
                    className="absolute z-10 flex flex-col gap-4 bottom-14 left-4 right-4 md:bottom-24 md:left-16 md:right-auto"
                    style={{ maxWidth: 'min(480px, 100%)' }}
                >
                    {/* Badges */}
                    <div className="flex items-center gap-3">
                        <span
                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm text-white"
                            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
                        >
                            {heroType}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span style={{ color: "#eab308", fontSize: '14px' }}>★</span>
                            <span className="text-sm font-semibold text-white">{heroRating}</span>
                        </div>
                    </div>

                    {/* Título */}
                    <h1
                        className="font-bold text-white leading-[1.1]"
                        style={{ fontSize: 'clamp(1.6rem, 5vw, 3.2rem)', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
                    >
                        {hero.title || hero.name}
                    </h1>

                    {/* Sinopsis — oculta en móvil pequeño */}
                    <p className="text-sm leading-relaxed hidden sm:block" style={{ color: '#9ca3af', maxWidth: '42ch' }}>
                        {hero.overview
                            ? hero.overview.slice(0, 165) + (hero.overview.length > 165 ? '...' : '')
                            : 'Sin descripción disponible.'}
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 mt-1">
                        <button
                            onClick={() => navigate(`/details/${hero.media_type}/${hero.id}`)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                boxShadow: "0 0 28px rgba(124,58,237,0.45)"
                            }}
                        >
                            Ver detalles
                        </button>
                        <button
                            onClick={() => navigate(`/details/${hero.media_type}/${hero.id}`)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/10"
                            style={{
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "rgba(255,255,255,0.82)",
                                backdropFilter: "blur(10px)"
                            }}
                        >
                            + Lista
                        </button>
                    </div>
                </div>

                {/* Scroll indicator — solo desktop */}
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex" style={{ opacity: 0.35 }}>
                    <div
                        className="w-px h-10"
                        style={{ background: "linear-gradient(to bottom, transparent, white)", animation: "pulse 2s ease-in-out infinite" }}
                    />
                    <span className="text-white text-[9px] uppercase tracking-[0.28em]">Scroll</span>
                </div>
            </div>

            {/* ── Carruseles ───────────────────────────────── */}
            <div className="pt-4 pb-16">
                <CarouselSection titulo="En tendencia" peliculas={trending.slice(1)} />
                <CarouselSection titulo="Películas populares" peliculas={popular_movies} mediaType="movie" />
                <CarouselSection titulo="Series populares" peliculas={popular_series} mediaType="tv" />
                <CarouselSection titulo="Mejor valoradas — Cine" peliculas={top_rated_movies} mediaType="movie" />
                <CarouselSection titulo="Mejor valoradas — Series" peliculas={top_rated_series} mediaType="tv" />
                <CarouselSection titulo="Comedia" peliculas={top_comedy_series} mediaType="tv" />
                <CarouselSection titulo="Acción" peliculas={top_action_movies} mediaType="movie" />
                <CarouselSection titulo="Terror" peliculas={top_horror_movies} mediaType="movie" />
            </div>
        </div>
    )
}
