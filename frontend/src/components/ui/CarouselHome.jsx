import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import MovieCard from "./MovieCard"

export default function CarouselSection({ titulo, peliculas, mediaType }) {
    return (
        <div className="px-16 mb-8">
            <h2 className="text-white text-xl font-bold mb-4">{titulo}</h2>
            <Carousel>
                <CarouselContent>
                    {peliculas.map(pelicula => (
                        <CarouselItem key={pelicula.id} className="basis-1/8">
                            <MovieCard movie={pelicula} mediaType={mediaType || pelicula.media_type}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}