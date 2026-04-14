import { useState, useEffect } from "react";
import api from "../api";

export default function useReviews(tmdb_id, media_type) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setReviews([...reviews, res.datos]);
        } catch (error) {
            setError(error);
        }
    }

    const editReview = async (reviewId, reviewData) => {
        try {
            const res = await api.put(`/reviews/${reviewId}`, reviewData);
            setReviews(reviews.map(review => review.id === reviewData.id ? res.datos : review));
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