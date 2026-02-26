const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const Respuesta = require('../utils/respuesta.js');

const verifyToken = (req, res, next) => {
  // Leer el token de la cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(Respuesta.error(null, "No tienes autorización"));
  }

  try {
    // Verificar que el token es válido y no ha expirado
    const decoded = jwt.verify(token, config.secretKey);
    // Guardamos los datos del usuario en req para usarlos en el controlador
    req.user = decoded;
    next(); // todo ok, dejamos pasar
  } catch (error) {
    return res.status(401).json(Respuesta.error(null, "Token inválido o expirado"));
  }
};

module.exports = { verifyToken };