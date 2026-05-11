const { validationResult } = require("express-validator")
const Respuesta = require("../utils/respuesta")

// Middleware que lee los errores de express-validator
// y los devuelve en el formato estándar de la API
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const mensaje = errors.array()[0].msg
        return res.status(400).json(Respuesta.error(null, mensaje))
    }
    next()
}

module.exports = validate