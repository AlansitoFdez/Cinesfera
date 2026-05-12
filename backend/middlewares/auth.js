const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const Respuesta = require('../utils/respuesta.js');
const initModels = require('../models/init-models').initModels;
const sequelize = require('../config/sequelize');

const models = initModels(sequelize);
const User = models.users;

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json(Respuesta.error(null, "No tienes autorización"));
    }
    try {
        const decoded = jwt.verify(token, config.secretKey);

        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'email', 'role', 'banned']
        });

        if (!user) {
            return res.status(401).json(Respuesta.error(null, "Usuario no encontrado"));
        }
        if (user.banned) {
            return res.status(403).json(Respuesta.error(null, "Tu cuenta ha sido suspendida"));
        }

        req.user = user.dataValues;
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