import { useState, useEffect } from "react";
import api from "../api";

export default function useHomeData() {
    const [trending, setTrending] = useState([]);
    const [popular_movies, setPopularMovies] = useState([]);
    const [popular_series, setPopularSeries] = useState([]);
    const [top_rated_movies, setTopRatedMovies] = useState([]);
    const [top_rated_series, setTopRatedSeries] = useState([]);
    const [top_comedy_series, setTopComedySeries] = useState([]);
    const [top_action_movies, setTopActionMovies] = useState([]);
    const [top_horror_movies, setTopHorrorMovies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            const resultados = await Promise.allSettled([
                api.get('/home/trending'),
                api.get('/home/popular/movie'),
                api.get('/home/popular/tv'),
                api.get('/home/top_rated/movie'),
                api.get('/home/top_rated/tv'),
                api.get('/home/by_genre/tv/35'),
                api.get('/home/by_genre/movie/28'),
                api.get('/home/by_genre/movie/27'),
            ])

            const get = (r) => r.status === 'fulfilled' ? (r.value.datos.results ?? []) : []

            const [
                resTrending, resPopularMovies, resPopularSeries,
                resTopRatedMovies, resTopRatedSeries, resTopComedySeries,
                resTopActionMovies, resTopHorrorMovies
            ] = resultados

            setTrending(get(resTrending))
            setPopularMovies(get(resPopularMovies))
            setPopularSeries(get(resPopularSeries))
            setTopRatedMovies(get(resTopRatedMovies))
            setTopRatedSeries(get(resTopRatedSeries))
            setTopComedySeries(get(resTopComedySeries))
            setTopActionMovies(get(resTopActionMovies))
            setTopHorrorMovies(get(resTopHorrorMovies))

            // Solo error si todas fallaron
            if (resultados.every(r => r.status === 'rejected')) {
                setError(true)
            }

            setLoading(false)
        }
        cargarDatos()
    }, []);

    return {
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
    }
}