const { logMensaje } = require("../utils/logger.js")
const Respuesta = require("../utils/respuesta.js")
const userService = require("../services/userService")

class UserController {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await userService.login(email, password);
      return res.status(200).json(Respuesta.exito(result, "Login exitoso"));
    } catch (error) {
      logMensaje(error);
      return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al iniciar sesión"));
    }
  }

  async signup(req, res) {
    const { username, email, password, biography } = req.body;
    try {
      const newUser = await userService.signup(username, email, password, biography);
      return res.status(201).json(Respuesta.exito(newUser, "Usuario registrado exitosamente"));
    } catch (error) {
      logMensaje(error);
      return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al registrar usuario"));
    }
  }
}

module.exports = new UserController()