const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)
const bcrypt = require("bcrypt")

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

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId)

    if(!user) {
      throw new Error("Usuario no encontrado")
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if(!isPasswordValid) {
      throw new Error("Contraseña actual incorrecta")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await User.update({ password: hashedPassword }, { where: { id: userId } })
  }
}

module.exports = new UserService()