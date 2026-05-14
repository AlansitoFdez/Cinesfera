import { useState } from "react"
import api from "../api"

export default function useRecommendations() {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    const getRecommendations = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get("/recommendations")
            setRecommendations(res.datos)
            setHasLoaded(true)
        } catch (err) {
            setError(err.mensaje || "Error al obtener recomendaciones")
        } finally {
            setLoading(false)
        }
    }

    return { recommendations, loading, error, hasLoaded, getRecommendations }
}