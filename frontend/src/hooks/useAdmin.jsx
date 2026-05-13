import { useState, useCallback } from "react"
import api from "../api"

export default function useAdmin() {

    const [users, setUsers] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 })
    const [reviewsPagination, setReviewsPagination] = useState({ page: 1, totalPages: 1, total: 0 })
    const [stats, setStats] = useState(null)

    const getUsers = useCallback(async ({ page = 1, limit = 10, search = "" } = {}) => {
        setLoading(true)
        try {
            const res = await api.get("/admin/users", { params: { page, limit, search } })
            setUsers(res.datos.data)
            setUsersPagination({ page: res.datos.page, totalPages: res.datos.totalPages, total: res.datos.total })
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const getStats = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get("/admin/stats")
            setStats(res.datos)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const banUser = async (id) => {
        try {
            const res = await api.patch(`/admin/users/${id}/ban`)
            setUsers(users.map(u => u.id === id ? { ...u, banned: res.datos.banned } : u))
        } catch (error) {
            setError(error)
        }
    }

    const changeRole = async (id) => {
        try {
            const res = await api.patch(`/admin/users/${id}/role`)
            setUsers(users.map(u => u.id === id ? { ...u, role: res.datos.role } : u))
        } catch (error) {
            setError(error)
        }
    }

    const deleteUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`)
            setUsers(users.filter(u => u.id !== id))
        } catch (error) {
            setError(error)
        }
    }

    const getReviews = useCallback(async ({ page = 1, limit = 10, search = "" } = {}) => {
        setLoading(true)
        try {
            const res = await api.get("/admin/reviews", { params: { page, limit, search } })
            setReviews(res.datos.data)
            setReviewsPagination({ page: res.datos.page, totalPages: res.datos.totalPages, total: res.datos.total })
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteReview = async (id) => {
        try {
            await api.delete(`/admin/reviews/${id}`)
            setReviews(reviews.filter(r => r.id !== id))
        } catch (error) {
            setError(error)
        }
    }

    return {
        users, reviews, loading, error,
        usersPagination, reviewsPagination,
        getUsers, banUser, changeRole, deleteUser,
        getReviews, deleteReview, getStats, stats
    }
}