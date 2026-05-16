import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import MovieCard from "./MovieCard"

export default function CarouselSection({ titulo, peliculas, mediaType }) {
    const sectionRef = useRef(null)
    const titleRef   = useRef(null)
    const navigate   = useNavigate()

    const verTodoRuta = mediaType === 'movie' ? '/movies' : mediaType === 'tv' ? '/series' : null

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        gsap.set(el, { opacity: 0, y: 28 })

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return

                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
                observer.unobserve(el)
            },
            { threshold: 0.06 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const navBtnStyle = {
        background:      'rgba(6,8,16,0.9)',
        backdropFilter:  'blur(10px)',
        color:           'white',
        boxShadow:       '0 0 0 1px rgba(255,255,255,0.07)',
        transition:      'box-shadow 0.2s, background 0.2s'
    }

    const handleNavEnter = e => {
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(124,58,237,0.5), 0 0 14px rgba(109,40,217,0.25)'
        e.currentTarget.style.background = 'rgba(109,40,217,0.18)'
    }
    const handleNavLeave = e => {
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.07)'
        e.currentTarget.style.background = 'rgba(6,8,16,0.9)'
    }

    return (
        <div ref={sectionRef} className="px-4 sm:px-8 md:px-14 mb-10">

            {/* Cabecera */}
            <div ref={titleRef} className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-[3px] h-5 rounded-full shrink-0"
                        style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }}
                    />
                    <h2
                        className="text-sm sm:text-base font-bold tracking-wide"
                        style={{ color: '#e5e7eb' }}
                    >
                        {titulo}
                    </h2>
                </div>

                {verTodoRuta && (
                    <button
                        onClick={() => navigate(verTodoRuta)}
                        className="text-xs font-semibold transition-colors duration-150 flex items-center gap-1"
                        style={{ color: '#4b5563' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                        onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                    >
                        Ver todo
                        <span style={{ fontSize: '10px' }}>→</span>
                    </button>
                )}
            </div>

            {/* Carrusel */}
            <Carousel opts={{ align: 'start', dragFree: true }}>
                <CarouselContent className="-ml-3">
                    {peliculas.map(pelicula => (
                        <CarouselItem
                            key={pelicula.id}
                            className="pl-3 basis-[48%] sm:basis-[33%] md:basis-1/4 lg:basis-1/5 xl:basis-[calc(100%/6.5)]"
                        >
                                <MovieCard
                                    movie={pelicula}
                                    mediaType={mediaType || pelicula.media_type}
                                />
                            </CarouselItem>
                        ))}
                </CarouselContent>

                <CarouselPrevious
                    className="left-0 -translate-x-1/2 border-0 hidden md:flex"
                    style={navBtnStyle}
                    onMouseEnter={handleNavEnter}
                    onMouseLeave={handleNavLeave}
                />
                <CarouselNext
                    className="right-0 translate-x-1/2 border-0 hidden md:flex"
                    style={navBtnStyle}
                    onMouseEnter={handleNavEnter}
                    onMouseLeave={handleNavLeave}
                />
            </Carousel>

            {/* Divisor */}
            <div
                className="mt-9 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.08) 30%, rgba(124,58,237,0.08) 70%, transparent)" }}
            />
        </div>
    )
}
