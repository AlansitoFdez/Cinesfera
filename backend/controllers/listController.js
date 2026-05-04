const listService = require("../services/listService")
const Respuesta = require("../utils/respuesta")
const { logMensaje } = require("../utils/logger")

class ListController {

    async getMyLists(req, res) {
        try {
            const lists = await listService.getMyLists(req.user.sub)
            return res.status(200).json(Respuesta.exito(lists, "Listas obtenidas correctamente"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error("Error al obtener las listas"))
        }
    }

    async getListsForDropdown(req, res) {
        try {
            const { tmdbId, mediaType } = req.params
            const lists = await listService.getListsForDropdown(req.user.sub, parseInt(tmdbId), mediaType)
            return res.status(200).json(Respuesta.exito(lists, "Listas para dropdown obtenidas correctamente"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error("Error al obtener las listas"))
        }
    }

    async getPublicListsByUser(req, res) {
        try {
            const { userId } = req.params
            const lists = await listService.getPublicListsByUser(parseInt(userId))
            return res.status(200).json(Respuesta.exito(lists, "Listas públicas obtenidas correctamente"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error("Error al obtener las listas del usuario"))
        }
    }
}

module.exports = new ListController()