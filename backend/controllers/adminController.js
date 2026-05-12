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

    async banUser(req, res) {
        try {
            const user = await adminService.banUser(req.params.id)
            return res.status(200).json(Respuesta.exito(user, `Usuario ${user.banned ? "baneado" : "desbaneado"} exitosamente`))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al banear el usuario"))
        }
    }

    async changeRole(req, res) {
        try {
            const user = await adminService.changeRole(req.params.id)
            return res.status(200).json(Respuesta.exito(user, `Rol cambiado a ${user.role} exitosamente`))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al cambiar el rol"))
        }
    }

    async deleteUser(req, res) {
        try {
            await adminService.deleteUser(req.params.id)
            return res.status(200).json(Respuesta.exito(null, "Usuario eliminado exitosamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(error.message))
            }
            return res.status(500).json(Respuesta.error("Error al eliminar el usuario"))
        }
    }

}

module.exports = new AdminController()