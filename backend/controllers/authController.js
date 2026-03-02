const { logMensaje } = require("../utils/logger.js")
const Respuesta = require("../utils/respuesta.js")
const authService = require("../services/authService.js")

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const { user, token } = await authService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000
      })
      
      return res.status(200).json(Respuesta.exito(user, "Login exitoso"));
    } catch (error) {
      logMensaje(error);
      return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al iniciar sesión"));
    }
  }

  async signup(req, res) {
    const { username, email, password, biography } = req.body;
    try {
      const newUser = await authService.signup(username, email, password, biography);
      return res.status(201).json(Respuesta.exito(newUser, "Usuario registrado exitosamente"));
    } catch (error) {
      logMensaje(error);
      return res.status(error.status || 500).json(Respuesta.error(null, error.message || "Error al registrar usuario"));
    }
  }

  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    return res.status(200).json(Respuesta.exito(null, "Cierre de sesión exitoso"));
  }
}

module.exports = new AuthController()