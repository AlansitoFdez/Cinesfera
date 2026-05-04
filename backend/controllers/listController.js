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
}

module.exports = new ListController()