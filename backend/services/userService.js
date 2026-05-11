const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)
const bcrypt = require("bcrypt")
const { uploadToCloudinary } = require("../config/cloudinary")

const User = models.users

// Helper: crea un error de lógica de negocio con la marca isControlled
// para que el controlador lo convierta en 400 en vez de 500
const controlledError = (message) => {
  const err = new Error(message)
  err.isControlled = true
  return err
}

class UserService {

  async getAllUsers() {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    })
    return users
  }

  async deleteAccount(userId) {
    try {
      const user = await User.findByPk(userId)
      if (!user) throw new Error("Usuario no encontrado")
      await user.destroy()
    } catch (error) {
      throw error
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId)
    if (!user) throw new Error("Usuario no encontrado")

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) throw controlledError("Contraseña actual incorrecta")

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.update({ password: hashedPassword }, { where: { id: userId } })
  }

  async updateProfile(userId, { username, email, biography, avatarFile }) {

    // ── Validaciones de unicidad ──────────────────────────────────────────────
    if (email) {
      const existing = await User.findOne({ where: { email } })
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

    // ── Subida de avatar a Cloudinary (solo si llegó un archivo) ─────────────
    let avatarUrl
    if (avatarFile) {
      avatarUrl = await uploadToCloudinary(avatarFile.buffer, userId)
    }

    // ── Construir objeto con solo los campos que llegaron ─────────────────────
    const fieldsToUpdate = {}
    if (username !== undefined) fieldsToUpdate.username = username
    if (email !== undefined) fieldsToUpdate.email = email
    if (biography !== undefined) fieldsToUpdate.biography = biography
    if (avatarUrl !== undefined) fieldsToUpdate.avatar = avatarUrl

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw controlledError("No se han enviado campos para actualizar")
    }

    await User.update(fieldsToUpdate, { where: { id: userId } })

    // En MySQL no hay "returning" así que hacemos un SELECT después del UPDATE
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    return updatedUser
  }

  async getProfile(username) {
    const user = await User.findOne({
      where: { username },
      attributes: { exclude: ["password", "email", "banned"] }
    })

    if (!user) throw controlledError("Usuario no encontrado")

    // Contamos por separado — más limpio y sin problemas de subqueries
    const reviewsCount = await models.reviews.count({ where: { user_id: user.id } })
    const followersCount = await models.follows.count({ where: { followed_id: user.id } })
    const followingCount = await models.follows.count({ where: { follower_id: user.id } })

    // Añadimos los conteos al objeto del usuario
    return {
      ...user.dataValues,
      reviews_count: reviewsCount,
      followers_count: followersCount,
      following_count: followingCount
    }
  }

  async getProfileReviews(username) {
    // 1. Primero buscamos el usuario para obtener su id
    //    No podemos hacer WHERE username en reviews, reviews solo tiene user_id
    const user = await User.findOne({ where: { username }, attributes: ["id"] })
    if (!user) throw controlledError("Usuario no encontrado")

    // 2. Buscamos sus reviews con JOIN a content_cache
    const reviews = await models.reviews.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: models.contentCache,
          as: "tmdb",  // el alias que está en init-models
          attributes: ["title", "poster_path", "media_type"]
        }
      ],
      order: [["created_at", "DESC"]], // las más recientes primero
      limit: 4  // solo las últimas 4 para el perfil
    })

    return reviews
  }

  async getProfileFavorites(username) {
    // 1. Buscamos el usuario
    const user = await User.findOne({ where: { username }, attributes: ["id"] })
    if (!user) throw controlledError("Usuario no encontrado")

    // 2. Buscamos la lista con is_default = 1 de ese usuario
    const favoritesList = await models.lists.findOne({
      where: { user_id: user.id, is_default: 1 },
      // 3. JOIN a list_items y de ahí a content_cache
      include: [
        {
          model: models.listItems,
          as: "list_items",
          include: [
            {
              model: models.contentCache,
              as: "tmdb",
              attributes: ["tmdb_id", "title", "poster_path", "media_type"]
            }
          ],
          limit: 8  // solo los primeros 8 para el perfil
        }
      ]
    })

    // 4. Si no tiene lista (no debería pasar, pero por si acaso)
    if (!favoritesList) return []

    // 5. Aplanamos la respuesta — no queremos devolver la lista entera,
    //    solo el array de contenido
    return favoritesList.list_items.map(item => item.tmdb)
  }

}

module.exports = new UserService()