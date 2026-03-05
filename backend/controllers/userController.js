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


  async deleteAccount(req, res) {
    try {
      const userId = req.user.sub

      await userService.deleteAccount(userId)

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      return res.status(200).json(Respuesta.exito(null, "Cuenta eliminada exitosamente"));
    } catch (error) {
      logMensaje(error);
      return res.status(500).json(Respuesta.error("Error al eliminar cuenta"));
    }
  }
}

module.exports = new UserController()