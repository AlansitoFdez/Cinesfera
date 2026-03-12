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
            try {
                const [resTrending, resPopularMovies, resPopularSeries, resTopRatedMovies, resTopRatedSeries, resTopComedySeries, resTopActionMovies, resTopHorrorMovies] = await Promise.all([
                    api.get('/home/trending'),
                    api.get('/home/popular/movie'),
                    api.get('/home/popular/tv'),
                    api.get('/home/top_rated/movie'),
                    api.get('/home/top_rated/tv'),
                    api.get('/home/by_genre/tv/35'),
                    api.get('/home/by_genre/movie/28'),
                    api.get('/home/by_genre/movie/27'),
                ])

                setTrending(resTrending.datos.results.slice(0, 11));
                setPopularMovies(resPopularMovies.datos.results.slice(0, 10));
                setPopularSeries(resPopularSeries.datos.results.slice(0, 10));
                setTopRatedMovies(resTopRatedMovies.datos.results.slice(0, 10));
                setTopRatedSeries(resTopRatedSeries.datos.results.slice(0, 10));
                setTopComedySeries(resTopComedySeries.datos.results.slice(0, 10));
                setTopActionMovies(resTopActionMovies.datos.results.slice(0, 10));
                setTopHorrorMovies(resTopHorrorMovies.datos.results.slice(0, 10));
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        cargarDatos();
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
        

