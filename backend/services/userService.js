const initModels = require("../models/init-models").initModels
const bcrypt = require("bcrypt")
const Respuesta = require("../utils/respuesta")
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users

class UserService {
    async login(email, password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw Respuesta.error(null, "Usuario no encontrado o inexistente")
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            throw Respuesta.error(null, "Contraseña incorrecta")
        }

        return user;
    }
}

module.exports = new UserService()
