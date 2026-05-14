import { useState, useEffect } from "react"
import api from "../api"

export default function useSearch(query) {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!query) return

        const fetchResults = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await api.get("/home/search", { params: { query } })
                setResults(response.datos)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return { results, loading, error }
}