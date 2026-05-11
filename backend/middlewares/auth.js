const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const Respuesta = require('../utils/respuesta.js');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json(Respuesta.error(null, "No tienes autorización"));
    }
    try {
        const decoded = jwt.verify(token, config.secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(Respuesta.error(null, "Token inválido o expirado"));
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json(Respuesta.error(null, "Acceso restringido a administradores"));
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };