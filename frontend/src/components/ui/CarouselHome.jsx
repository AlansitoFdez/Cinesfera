import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import MovieCard from "./MovieCard"

export default function CarouselSection({ titulo, peliculas, mediaType }) {
    const sectionRef = useRef(null)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        gsap.set(el, { opacity: 0, y: 28 })

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                gsap.to(el, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' })
                observer.unobserve(el)
            },
            { threshold: 0.08 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={sectionRef} className="px-14 mb-10">

            {/* Cabecera de sección */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className="w-[3px] h-5 rounded-full shrink-0"
                    style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }}
                />
                <h2
                    className="text-base font-semibold tracking-wide"
                    style={{ color: '#e5e7eb' }}
                >
                    {titulo}
                </h2>
            </div>

            {/* Carrusel */}
            <Carousel opts={{ align: 'start', dragFree: true }}>
                <CarouselContent className="-ml-3">
                    {peliculas.map(pelicula => (
                        <CarouselItem
                            key={pelicula.id}
                            className="pl-3"
                            style={{ flexBasis: 'calc(100% / 6.5)' }}
                        >
                            <MovieCard
                                movie={pelicula}
                                mediaType={mediaType || pelicula.media_type}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="left-0 -translate-x-1/2 border-0"
                    style={{
                        background: "rgba(13,17,23,0.85)",
                        backdropFilter: "blur(8px)",
                        color: "white",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.08)"
                    }}
                />
                <CarouselNext
                    className="right-0 translate-x-1/2 border-0"
                    style={{
                        background: "rgba(13,17,23,0.85)",
                        backdropFilter: "blur(8px)",
                        color: "white",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.08)"
                    }}
                />
            </Carousel>

            {/* Divisor sutil */}
            <div
                className="mt-9 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, transparent)" }}
            />
        </div>
    )
}
