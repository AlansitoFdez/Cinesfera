import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useHomeData from '../../hooks/useHomeData'
import CarouselSection from '../ui/CarouselHome'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
    const navigate = useNavigate()
    const heroRef = useRef(null)
    const heroImgRef = useRef(null)
    const heroContentRef = useRef(null)
    const thumbsRef = useRef(null)
    const [heroIndex, setHeroIndex] = useState(0)

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
                { scale: 1.12, filter: 'brightness(0.15) saturate(0.4)' },
                { scale: 1.02, filter: 'brightness(1) saturate(1)', duration: 2.4, ease: 'power2.out' }
            )

            const children = [...heroContentRef.current.children]
            gsap.fromTo(children,
                { y: 52, opacity: 0, filter: 'blur(6px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, stagger: 0.14, ease: 'expo.out', delay: 0.7 }
            )

            if (thumbsRef.current?.children.length) {
                gsap.fromTo([...thumbsRef.current.children],
                    { y: 28, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.65, stagger: 0.06, ease: 'power3.out', delay: 1.3 }
                )
            }

            gsap.to(heroImgRef.current, {
                yPercent: 22,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2
                }
            })
        })

        return () => ctx.revert()
    }, [trending])

    const changeHero = (idx) => {
        if (idx === heroIndex || !heroImgRef.current) return
        gsap.to(heroImgRef.current, {
            opacity: 0, duration: 0.32, ease: 'power2.in',
            onComplete: () => {
                setHeroIndex(idx)
                gsap.to(heroImgRef.current, { opacity: 1, duration: 0.55, ease: 'power2.out' })
            }
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: '#060810' }}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(124,58,237,0.15)' }} />
                    <div className="absolute inset-0 rounded-full animate-spin" style={{ borderTop: '1.5px solid #7c3aed', borderRight: '1.5px solid transparent', borderBottom: '1.5px solid transparent', borderLeft: '1.5px solid transparent' }} />
                    <div className="absolute inset-2 rounded-full animate-spin" style={{ borderTop: '1.5px solid rgba(168,85,247,0.4)', borderRight: '1.5px solid transparent', borderBottom: '1.5px solid transparent', borderLeft: '1.5px solid transparent', animationDuration: '1.5s', animationDirection: 'reverse' }} />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="uppercase tracking-[0.4em] text-[10px] font-semibold" style={{ color: '#6d28d9' }}>Cinesfera</p>
                    <p className="uppercase tracking-[0.2em] text-[9px]" style={{ color: '#1f2937' }}>Cargando</p>
                </div>
            </div>
        )
    }

    if (error || !trending.length) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#060810' }}>
                <p style={{ color: '#f87171', fontSize: '0.9rem' }}>Error al cargar el contenido.</p>
            </div>
        )
    }

    const hero = trending[heroIndex]
    const heroRating = hero.vote_average?.toFixed(1)
    const heroType = hero.media_type === 'movie' ? 'Película' : 'Serie'
    const ratingPct = Math.round((hero.vote_average / 10) * 100)

    return (
        <div style={{ background: '#060810', minHeight: '100vh' }}>

            {/* ── Hero ─────────────────────────────────────── */}
            <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: '100svh' }}>

                {/* Backdrop */}
                <img
                    ref={heroImgRef}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
                    alt={hero.title || hero.name}
                />

                {/* Cinematic grain */}
                <div className="absolute inset-0 pointer-events-none z-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                    opacity: 0.65, mixBlendMode: 'overlay'
                }} />

                {/* Top vignette */}
                <div className="absolute top-0 left-0 right-0 z-20" style={{ height: '130px', background: 'linear-gradient(to bottom, #060810 0%, transparent 100%)' }} />
                {/* Bottom vignette */}
                <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: '400px', background: 'linear-gradient(to top, #060810 0%, rgba(6,8,16,0.88) 32%, transparent 100%)' }} />
                {/* Left gradient */}
                <div className="absolute inset-0 z-20" style={{ background: 'linear-gradient(108deg, rgba(6,8,16,0.97) 0%, rgba(6,8,16,0.70) 38%, rgba(6,8,16,0.14) 64%, transparent 82%)' }} />
                {/* Right edge */}
                <div className="absolute inset-0 z-20 hidden lg:block" style={{ background: 'linear-gradient(to left, rgba(6,8,16,0.42) 0%, transparent 36%)' }} />

                {/* Purple spotlight glow */}
                <div className="absolute z-20 pointer-events-none" style={{
                    width: '700px', height: '700px',
                    top: '38%', left: '14%',
                    transform: 'translate(-50%, -60%)',
                    background: 'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 68%)',
                    borderRadius: '50%'
                }} />

                {/* ── Hero content ── */}
                <div
                    ref={heroContentRef}
                    className="absolute z-30 flex flex-col bottom-28 left-4 right-4 md:bottom-44 md:left-16 md:right-auto"
                    style={{ maxWidth: 'min(530px, 100%)', gap: '1.05rem' }}
                >
                    {/* Status badges */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(109,40,217,0.18)', border: '1px solid rgba(109,40,217,0.35)' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a78bfa' }} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: '#c4b5fd' }}>Trending</span>
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                            {heroType}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="font-black text-white"
                        style={{
                            fontSize: 'clamp(1.9rem, 5.5vw, 3.9rem)',
                            lineHeight: 1.0,
                            letterSpacing: '-0.015em',
                            textShadow: '0 4px 48px rgba(0,0,0,0.95), 0 1px 0 rgba(0,0,0,0.5)'
                        }}
                    >
                        {hero.title || hero.name}
                    </h1>

                    {/* Meta row */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="relative" style={{ width: 36, height: 36 }}>
                                <svg viewBox="0 0 36 36" style={{ width: 36, height: 36, transform: 'rotate(-90deg)' }}>
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                                    <circle
                                        cx="18" cy="18" r="15" fill="none"
                                        stroke="#eab308" strokeWidth="2.5"
                                        strokeDasharray={`${(ratingPct / 100) * 94.25} 94.25`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color: '#fbbf24' }}>{heroRating}</span>
                            </div>
                            <span className="text-[11px]" style={{ color: '#4b5563' }}>/ 10</span>
                        </div>
                        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                            {hero.media_type === 'movie' ? 'Cine' : 'Televisión'}
                        </span>
                        {hero.original_language && (
                            <>
                                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                <span className="text-[10px] uppercase font-medium" style={{ color: '#4b5563', letterSpacing: '0.1em' }}>{hero.original_language}</span>
                            </>
                        )}
                    </div>

                    {/* Overview */}
                    <p className="text-sm leading-relaxed hidden sm:block" style={{ color: '#9ca3af', maxWidth: '44ch' }}>
                        {hero.overview
                            ? hero.overview.slice(0, 160) + (hero.overview.length > 160 ? '…' : '')
                            : 'Sin descripción disponible.'}
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 mt-0.5">
                        <button
                            onClick={() => navigate(`/details/${hero.media_type}/${hero.id}`)}
                            className="group flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
                            style={{
                                background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)',
                                boxShadow: '0 0 36px rgba(109,40,217,0.52), 0 0 0 1px rgba(147,51,234,0.28)'
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Ver detalles
                        </button>
                        <button
                            onClick={() => navigate(`/details/${hero.media_type}/${hero.id}`)}
                            className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/10 active:scale-[0.97]"
                            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Lista
                        </button>
                    </div>
                </div>

                {/* ── Trending thumbnail strip ── */}
                <div
                    ref={thumbsRef}
                    className="absolute z-30 bottom-6 left-4 md:bottom-10 md:left-16 flex items-end gap-2"
                >
                    {trending.slice(0, 7).map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => changeHero(i)}
                            className="relative rounded overflow-hidden shrink-0 transition-all duration-300"
                            style={{
                                width: i === heroIndex ? '54px' : '42px',
                                height: i === heroIndex ? '76px' : '60px',
                                opacity: i === heroIndex ? 1 : 0.38,
                                border: `1.5px solid ${i === heroIndex ? 'rgba(124,58,237,0.85)' : 'rgba(255,255,255,0.07)'}`,
                                boxShadow: i === heroIndex ? '0 0 16px rgba(124,58,237,0.45)' : 'none'
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                alt={item.title || item.name}
                                className="w-full h-full object-cover"
                            />
                            {i === heroIndex && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#7c3aed' }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex" style={{ opacity: 0.22 }}>
                    <div className="w-px h-9" style={{ background: 'linear-gradient(to bottom, transparent, white)', animation: 'pulse 2s ease-in-out infinite' }} />
                    <span className="text-white text-[8px] uppercase tracking-[0.3em]">Scroll</span>
                </div>
            </div>

            {/* ── Carruseles ───────────────────────────────── */}
            <div className="pb-20" style={{ background: '#060810' }}>
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
