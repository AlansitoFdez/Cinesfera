const { logMensaje } = require("../utils/logger.js")
const Respuesta = require("../utils/respuesta.js")
const userService = require("../services/userService")

class UserController {
    async login(req, res) {
        const { email, password } = req.body
        try {
            const result = await userService.login(email, password)
            if (!result) {
                return res.status(401).json(Respuesta.error(null, "Credenciales inválidas"))
            }
            return res.status(200).json(Respuesta.exito(result, "Login exitoso"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error(null, "Error al iniciar sesión"))
        }
    }
}

module.exports = new UserController()