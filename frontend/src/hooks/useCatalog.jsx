import { useState, useEffect } from "react";
import api from "../api";

export default function useCatalog(type) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [genreId, setGenreId] = useState(null);

    // Carga inicial — tendencias
    useEffect(() => {
        const cargarTendencias = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/home/popular/${type}`);
                setResults(res.datos.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (!query && !genreId) {
            cargarTendencias();
        }
    }, [type, query, genreId]);

    // Búsqueda con debounce
    useEffect(() => {
        if (!query) return;

        const timer = setTimeout(async () => {
            setLoading(true);
            setGenreId(null);
            try {
                const res = await api.get(`/home/search`, { params: { query, type } });
                setResults(res.datos || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, type]);

    // Búsqueda por género
    useEffect(() => {
        if (!genreId) return;

        const cargarPorGenero = async () => {
            setLoading(true);
            setQuery("");
            try {
                const res = await api.get(`/home/by_genre/${type}/${genreId}`);
                setResults(res.datos.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        cargarPorGenero();
    }, [genreId, type]);

    return { results, loading, query, setQuery, genreId, setGenreId };
}
