const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users

class UserService {
  async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(userId) {
    try {
      const user = await User.findByPk(userId)

      if (!user) {
        throw new Error("Usuario no encontrado")
      }

      await user.destroy()
    } catch (error) {
      throw error
    }
  }
}

module.exports = new UserService()