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

    async search(query) {
        try {
            const response = await api.get(`/search/multi`, {params: {query, language: "es-ES"}})
            const datos = response.results
            return datos.filter(item => item.media_type === "movie" || item.media_type === "tv")
        } catch (error) {
            throw error
        }
    }

    async getDetails(type, id) {
        try {
            const [details, credits, videos, providers] = await Promise.allSettled([
                api.get(`/${type}/${id}`, {params: {language: "es-ES"}}),
                api.get(`/${type}/${id}/credits`, {params: {language: "es-ES"}}),
                api.get(`/${type}/${id}/videos`, {params: {language: "es-ES"}}),
                api.get(`/${type}/${id}/watch/providers`, {params: {watch_region: "ES"}})
            ])

            if (details.status === "rejected") throw new Error("Error al obtener los detalles")

            const data = details.value
            const creditsData = credits.status === "fulfilled" ? credits.value : null
            const videosData = videos.status === "fulfilled" ? videos.value : null
            const providersData = providers.status === "fulfilled" ? providers.value : null

            return {
                tmdb_id: data.id,
                title: data.title || data.name,
                overview: data.overview,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                release_date: data.release_date || data.first_air_date,
                vote_average: data.vote_average,
                vote_count: data.vote_count,
                genres: data.genres,
                runtime: data.runtime,
                seasons: data.seasons,
                cast: creditsData?.cast?.slice(0, 10) || [],
                trailer_key: videosData?.results?.find(video => video.site === "YouTube" && video.type === "Trailer")?.key || null,
                providers: providersData?.results?.ES?.flatrate || []
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new TmdbService()