import { useState, useEffect } from "react";
import api from "../../api";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../ui/MovieCard";


export default function Search() {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");


    useEffect(() => {
       const fetchMovies = async () => {
        try {
            const response = await api.get("/home/search", {params: {query: query}});
            setDatos(response.datos);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
       }
       fetchMovies(); 
    }, [query]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-amber-50">Search Results</h1>
            {loading && <p>Loading...</p>}
            {!loading && error && <p>Error: {error.message}</p>}
            {!loading && datos.length === 0 && <p>No results found.</p>}
            {!loading && datos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {datos.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} type={movie.media_type} />
                    ))}
                </div>
            )}
        </div>
    );
}