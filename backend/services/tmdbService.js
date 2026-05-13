const api = require("../config/backendApi")

class TmdbService {

    async getTrending() {
        return api.get("/trending/all/week", { params: { language: "es-ES" } })
    }

    async getPopular(type) {
        return api.get(`/${type}/popular`, { params: { language: "es-ES" } })
    }

    async getTopRated(type) {
        return api.get(`/${type}/top_rated`, { params: { language: "es-ES" } })
    }

    async getByGenre(type, id) {
        return api.get(`/discover/${type}`, { params: { with_genres: id, language: "es-ES" } })
    }

    async getProviders(type, id) {
        const response = await api.get(`/${type}/${id}/watch/providers`, { params: { watch_region: "ES" } })
        return response.results?.ES?.flatrate || []
    }

    async search(query, type = null) {
        const response = await api.get(`/search/multi`, { params: { query, language: "es-ES" } })
        return response.results.filter(item =>
            type ? item.media_type === type : item.media_type === "movie" || item.media_type === "tv"
        )
    }

    async getDetails(type, id) {
        const [details, credits, videos, providers] = await Promise.allSettled([
            api.get(`/${type}/${id}`, { params: { language: "es-ES" } }),
            api.get(`/${type}/${id}/credits`, { params: { language: "es-ES" } }),
            api.get(`/${type}/${id}/videos`, { params: { language: "es-ES" } }),
            api.get(`/${type}/${id}/watch/providers`, { params: { watch_region: "ES" } })
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
            trailer_key: videosData?.results?.find(v => v.site === "YouTube" && v.type === "Trailer")?.key || null,
            providers: providersData?.results?.ES?.flatrate || []
        }
    }
}

module.exports = new TmdbService()