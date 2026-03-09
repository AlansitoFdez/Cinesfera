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

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new Error("Contraseña actual incorrecta")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await User.update({ password: hashedPassword }, { where: { id: userId } })
  }

  async updateProfile(userId, { username, email, biography, avatarFile }) {
    if (email) {
      const existing = await User.findOne({ where: { email } })
      // Si ese email ya lo tiene otro usuario (no el propio) → error
      if (existing && existing.id !== userId) {
        throw controlledError("Ese correo electrónico ya está en uso")
      }
    }

    if (username) {
      const existing = await User.findOne({ where: { username } })
      if (existing && existing.id !== userId) {
        throw controlledError("Ese nombre de usuario ya está en uso")
      }
    }

    let avatarUrl
    if (avatarFile) {
      avatarUrl = await uploadToCloudinary(avatarFile.buffer, userId)
    }

    const fieldsToUpdate = {}
    if (username  !== undefined) fieldsToUpdate.username  = username
    if (email     !== undefined) fieldsToUpdate.email     = email
    if (biography !== undefined) fieldsToUpdate.biography = biography
    if (avatarUrl !== undefined) fieldsToUpdate.avatar    = avatarUrl

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw controlledError("No se han enviado campos para actualizar")
    }

    await User.update(fieldsToUpdate, { where: { id: userId } })

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    return updatedUser
  }
}

module.exports = new UserService()