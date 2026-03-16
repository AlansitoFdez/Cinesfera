import useHomeData from '../../hooks/useHomeData'
import CarouselSection from '../ui/CarouselHome'

export default function Home() {
    const {        trending,
        popular_movies,
        popular_series,
        top_rated_movies,
        top_rated_series,
        top_comedy_series,
        top_action_movies,
        top_horror_movies,
        loading,
        error} = useHomeData()
    const peliHero = trending[0]

    if (loading) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
            <div className="min-h-screen" style={{background: "#0d1117"}}>
                {/* Hero */}
                <div className='relative h-[75vh] w-full'>
                    <img className= "absolute inset-0 w-full h-full object-cover object-top" src={`https://image.tmdb.org/t/p/original${peliHero.backdrop_path}`} alt={peliHero.title || peliHero.name} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d1117 0%, transparent 60%)" }}></div>
                    <div className='z-10 absolute bottom-8 left-16 max-w-lg '>
                        <h1 className='text-4xl font-bold text-white'>{peliHero?.title || peliHero?.name}</h1>
                        <p className='text-lg mt-4 text-gray-300'>{peliHero?.overview?.slice(0, 150) + "..."}</p>
                        <button className='mt-4 px-4 py-2 rounded-lg font-bold text-white' style={{background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"}}>Ver más</button>
                    </div>
                </div>
                <CarouselSection titulo="Tendencias" peliculas={trending.slice(1)} />
                <CarouselSection titulo="Películas populares" peliculas={popular_movies} mediaType="movie" />
                <CarouselSection titulo="Series populares" peliculas={popular_series} mediaType="tv" />
                <CarouselSection titulo="Películas mejor valoradas" peliculas={top_rated_movies} mediaType="movie" />
                <CarouselSection titulo="Series mejor valoradas" peliculas={top_rated_series} mediaType="tv" />
                <CarouselSection titulo="Series de comedia" peliculas={top_comedy_series} mediaType="tv" />
                <CarouselSection titulo="Películas de acción" peliculas={top_action_movies} mediaType="movie" />
                <CarouselSection titulo="Películas de terror" peliculas={top_horror_movies} mediaType="movie" />
            </div>
            </>
        )
    }
}