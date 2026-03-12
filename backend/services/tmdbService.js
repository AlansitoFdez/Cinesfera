const api = require("../config/backendApi")

class TmdbService {

    async getTrending() {
        try {
            const response = await api.get("/trending/all/week", {params: {language: "es-ES"}})
            return response
        } catch (error) {
            throw error
        }
    }

    async getPopular(type) {
        try {
            const response = await api.get(`/${type}/popular`, {params: {language: "es-ES"}})
            return response
        } catch (error) {
            throw error
        }
    }

    async getTopRated(type) {
        try {
            const response = await api.get(`/${type}/top_rated`, {params: {language: "es-ES"}})
            return response
        } catch (error) {
            throw error
        }
    }

    async getByGenre(type, id) {
        try {
            const response = await api.get(`/discover/${type}`, {params:{with_genres: id, language: "es-ES"}})
            return response
        } catch (error) {
            throw error
        }
    }

    async getProviders(type, id) {
        try {
            const response = await api.get(`/${type}/${id}/watch/providers`, {params: {watch_region: "ES"}})
            return response.results?.ES?.flatrate || []
        } catch (error) {
            throw error
        }
    }
}

module.exports = new TmdbService()