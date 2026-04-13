import { useState, useEffect } from "react";
import api from "../api";

export default function useDetailData(type, id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!type || !id) return;

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/home/details/${type}/${id}`);
                setData(response.datos);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [type, id]);

    return { data, loading, error };
}