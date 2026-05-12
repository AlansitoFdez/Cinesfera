const adminService = require("../services/adminService.js")
const Respuesta = require("../utils/respuesta.js")
const { logMensaje } = require("../utils/logger.js")

class AdminController {

    async getUsers(req, res) {
        try {
            const result = await adminService.getUsers(req.query)
            return res.status(200).json(Respuesta.exito(result, "Usuarios obtenidos exitosamente"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error("Error al obtener los usuarios"))
        }
    }

}

module.exports = new AdminController()