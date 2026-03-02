const { logMensaje } = require("../utils/logger.js")
const Respuesta = require("../utils/respuesta.js")
const userService = require("../services/userService.js")

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(Respuesta.exito(users, "Usuarios obtenidos exitosamente"));
    } catch (error) {
      logMensaje(error);
      return res.status(500).json(Respuesta.error("Error al obtener usuarios"));
    }
  }
}

module.exports = new UserController()