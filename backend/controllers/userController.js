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

  async changePassword(req, res) {
    try {
      const userId = req.user.sub
      const { currentPassword, newPassword } = req.body

      if(!currentPassword || !newPassword) {
        return res.status(400).json(Respuesta.error("Debes enviar la contraseña actual y la nueva"))
      }

      await userService.changePassword(userId, currentPassword, newPassword)

      return res.status(200).json(Respuesta.exito(null, "Contraseña cambiada exitosamente"))
    } catch (error) {
      logMensaje(error)

      if(error.isControlled) {
        return res.status(400).json(Respuesta.error(error.message))
      }
      return res.status(500).json(Respuesta.error("Error al cambiar la contraseña"))
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.sub
      const { username, email, biography } = req.body

      const avatarFile = req.file

      const updatedUser = await userService.updateProfile(userId, { username, email, biography, avatarFile })

      return res.status(200).json(Respuesta.exito(updatedUser, "Perfil actualizado exitosamente"))
    } catch (error) {
      logMensaje(error)

      if(error.isControlled) {
        return res.status(400).json(Respuesta.error(error.message))
      }
      return res.status(500).json(Respuesta.error("Error al actualizar el perfil"))
    }
  }
}

module.exports = new UserController()