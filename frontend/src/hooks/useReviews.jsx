import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "./UseAuth";

export default function useReviews(tmdb_id, media_type) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const cargarReviews = async () => {
            try {
                const res = await api.get(`/reviews/${tmdb_id}/${media_type}`);
                setReviews(res.datos);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        cargarReviews();
    }, [tmdb_id, media_type]);
    
    const createReview = async (reviewData) => {
        try {
            const res = await api.post('/reviews', reviewData);
            const reviewConUsuario = {
                ...res.datos,
                user: {
                    id: user.sub,
                    username: user.username,
                    avatar: user.avatar
                }
            }
            setReviews([...reviews, reviewConUsuario])
        } catch (error) {
            setError(error);
        }
    }

    const editReview = async (reviewId, reviewData) => {
        try {
            const res = await api.put(`/reviews/${reviewId}`, reviewData);
            const reviewConUsuario = {
                ...res.datos,
                user: {
                    id: user.sub,
                    username: user.username,
                    avatar: user.avatar
                }
            }
            setReviews(reviews.map(review => review.id === reviewId ? reviewConUsuario : review));
        } catch (error) {
            setError(error);
        }
    }

    const deleteReview = async (reviewId) => {
        try {
            const res = await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review.id !== reviewId));
        } catch (error) {
            setError(error);
        }
    }

    return {
        reviews,
        loading,
        error,
        createReview,
        editReview,
        deleteReview
    }


}