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

    async createList(req, res) {
        try {
            const list = await listService.createList(req.user.sub, req.body)
            return res.status(201).json(Respuesta.exito(list, "Lista creada correctamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al crear la lista"))
        }
    }

    async getListDetail(req, res) {
        try {
            const list = await listService.getListDetail(parseInt(req.params.id), req.user.sub)
            return res.status(200).json(Respuesta.exito(list, "Lista obtenida correctamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al obtener el detalle de la lista"))
        }
    }

    async updateList(req, res) {
        try {
            const list = await listService.updateList(parseInt(req.params.id), req.user.sub, req.body)
            return res.status(200).json(Respuesta.exito(list, "Lista actualizada correctamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al actualizar la lista"))
        }
    }

    async deleteList(req, res) {
        try {
            await listService.deleteList(parseInt(req.params.id), req.user.sub)
            return res.status(200).json(Respuesta.exito(null, "Lista eliminada correctamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al eliminar la lista"))
        }
    }
}

module.exports = new ListController()