const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users
const Follow = models.follows


const controlledError = (message) => {
    const err = new Error(message)
    err.isControlled = true
    return err
}

class FollowService {

    // ── Seguir a un usuario ────────────────────────────────────────────────────
    async followUser(followerId, targetUsername) {
        // 1. Buscamos el usuario objetivo por username
        const targetUser = await User.findOne({ where: { username: targetUsername } })
        if (!targetUser) throw controlledError("Usuario no encontrado")

        // 2. No puedes seguirte a ti mismo
        if (targetUser.id === followerId) throw controlledError("No puedes seguirte a ti mismo")

        // 3. Intentamos crear el follow — si ya existe, la UNIQUE key de BD lo rechaza
        const [follow, created] = await Follow.findOrCreate({
            where: { follower_id: followerId, followed_id: targetUser.id }
        })

        if (!created) throw controlledError("Ya sigues a este usuario")

        return { following: true }
    }

}

module.exports = new FollowService()
