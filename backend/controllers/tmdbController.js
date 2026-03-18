const { logMensaje } = require("../utils/logger.js")
const Respuesta = require("../utils/respuesta.js")
const tmdbService = require("../services/tmdbService.js")

class TmdbController {
    async getTrending(req, res) {
        try {
            const response = await tmdbService.getTrending()
            return res.status(200).json(Respuesta.exito(response, "Listado Trending Exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener listado Trending"))
        }
    }

    async getPopular(req, res) {
        const {type} = req.params
        try {
            const response = await tmdbService.getPopular(type)
            return res.status(200).json(Respuesta.exito(response, "Listado Popular Exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener listado Popular"))
        }
    }

    async getTopRated(req, res) {
        const {type} = req.params
        try {
            const response = await tmdbService.getTopRated(type)
            return res.status(200).json(Respuesta.exito(response, "Listado Top Rated Exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener listado Top Rated"))
        }
    }

    async getByGenre(req, res) {
        const {type, id} = req.params
        try {
            const response = await tmdbService.getByGenre(type, id)
            return res.status(200).json(Respuesta.exito(response, "Listado por Genero Exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener listado por Genero"))
        }
    }

    async getProviders(req, res) {
        const {type, id} = req.params
        try {
            const response = await tmdbService.getProviders(type, id)
            return res.status(200).json(Respuesta.exito(response, "Listado de Proveedores Exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener listado de Proveedores"))
        }
    }


    async search(req, res) {
        const {query} = req.query
        try {
            const response = await tmdbService.search(query)
            return res.status(200).json(Respuesta.exito(response, "Busqueda Exitosa"))
        } catch (error) {
            logMensaje(error)
            return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al obtener busqueda"))
        }
    }
}

module.exports = new TmdbController()