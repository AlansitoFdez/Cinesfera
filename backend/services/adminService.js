const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize.js")
const models = initModels(sequelize)
const { Op } = require("sequelize")

const User = models.users

const controlledError = (message, status = 400) => {
    const err = new Error(message)
    err.isControlled = true
    err.status = status
    return err
}

class AdminService {

    async getUsers({ page = 1, limit = 10, search = "" }) {
        const offset = (page - 1) * limit

        const where = search
            ? {
                [Op.or]: [
                    { username: { [Op.like]: `%${search}%` } },
                    { email:    { [Op.like]: `%${search}%` } }
                ]
              }
            : {}

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: ["id", "username", "email", "role", "banned", "created_at"],
            order: [["created_at", "DESC"]],
            limit: Number(limit),
            offset: Number(offset)
        })

        return {
            data: rows,
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / limit)
        }
    }

    async banUser(id) {
        const user = await User.findByPk(id)
        if (!user) throw controlledError("Usuario no encontrado", 404)
        if (user.role === "ADMIN") throw controlledError("No puedes banear a un administrador")
        await user.update({ banned: !user.banned })
        return user
    }

    async changeRole(id) {
        const user = await User.findByPk(id)
        if (!user) throw controlledError("Usuario no encontrado", 404)
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
        await user.update({ role: newRole })
        return user
    }

    async deleteUser(id) {
        const user = await User.findByPk(id)
        if (!user) throw controlledError("Usuario no encontrado", 404)
        if (user.role === "ADMIN") throw controlledError("No puedes eliminar a un administrador")
        await user.destroy()
    }

}

module.exports = new AdminService()