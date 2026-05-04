import { useState, useEffect } from "react";
import api from "../api";

export default function useProfile(username, currentUserId) {
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Estado del botón de follow ─────────────────────────────────────────
    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (!username) return;

        const cargarPerfil = async () => {
            setLoading(true);
            setError(null);
            try {
                // Las tres llamadas base en paralelo, igual que antes
                const [resProfile, resReviews, resFavorites] = await Promise.all([
                    api.get(`/user/${username}`),
                    api.get(`/user/${username}/reviews`),
                    api.get(`/user/${username}/favorites`),
                ])

                setProfile(resProfile.datos);
                setReviews(resReviews.datos);
                setFavorites(resFavorites.datos);

                // Solo consultamos el estado del follow si hay usuario logueado
                // y no es su propio perfil — no tiene sentido preguntarle al backend
                // si te sigues a ti mismo
                if (currentUserId) {
                    const resFollow = await api.get(`/follow/status/${username}`)
                    setFollowing(resFollow.datos.following)
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        cargarPerfil();
    }, [username, currentUserId]);

    // ── Acción de seguir / dejar de seguir ────────────────────────────────
    const toggleFollow = async () => {
        setFollowLoading(true)
        try {
            if (following) {
                await api.delete(`/follow/${username}`)
                // Actualizamos el contador en local sin recargar el perfil entero
                setProfile(prev => ({ ...prev, followers_count: prev.followers_count - 1 }))
            } else {
                await api.post(`/follow/${username}`)
                setProfile(prev => ({ ...prev, followers_count: prev.followers_count + 1 }))
            }
            // Invertimos el estado del botón
            setFollowing(prev => !prev)
        } catch (err) {
            console.error("Error al cambiar follow:", err)
        } finally {
            setFollowLoading(false)
        }
    }

    return { profile, reviews, favorites, loading, error, following, followLoading, toggleFollow };
}