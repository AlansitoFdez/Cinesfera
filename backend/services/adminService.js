const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize.js")
const models = initModels(sequelize)
const { Op } = require("sequelize")

const User = models.users

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

}

module.exports = new AdminService()