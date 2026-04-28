import { useState, useEffect } from "react";
import api from "../api";

export default function useProfile(username) {
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si no hay username no hacemos nada
        if (!username) return;

        const cargarPerfil = async () => {
            setLoading(true);
            setError(null);
            try {
                // Las tres llamadas en paralelo, igual que useHomeData
                const [resProfile, resReviews, resFavorites] = await Promise.all([
                    api.get(`/user/${username}`),
                    api.get(`/user/${username}/reviews`),
                    api.get(`/user/${username}/favorites`),
                ])

                setProfile(resProfile.datos);
                setReviews(resReviews.datos);
                setFavorites(resFavorites.datos);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        cargarPerfil();
    }, [username]); // se re-ejecuta si cambia el username

    return { profile, reviews, favorites, loading, error };
}