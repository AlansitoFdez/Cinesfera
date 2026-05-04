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

    async unfollowUser(followerId, targetUsername) {
        // 1. Buscamos el usuario objetivo por username
        const targetUser = await User.findOne({ where: { username: targetUsername } })
        if (!targetUser) throw controlledError("Usuario no encontrado")

        // 2. Intentamos borrar el follow
        const deleted = await Follow.destroy({
            where: { follower_id: followerId, followed_id: targetUser.id }
        })

        if (deleted === 0) throw controlledError("No sigues a este usuario")

        return { following: false }
    }

    async getFollowStatus(followerId, targetUsername) {
        const targetUser = await User.findOne({ where: { username: targetUsername } })
        if (!targetUser) throw controlledError("Usuario no encontrado")

        const follow = await Follow.findOne({
            where: { follower_id: followerId, followed_id: targetUser.id }
        })

        return { following: !!follow }
    }


    async getFriends(userId) {
        // 1. IDs de usuarios a los que YO sigo
        const iFollow = await Follow.findAll({
            where: { follower_id: userId },
            attributes: ["followed_id"]
        })
        const iFollowIds = iFollow.map(f => f.followed_id)

        if (iFollowIds.length === 0) return []

        // 2. De esos, los que también me siguen a mí → amigos mutuos
        const mutualFollows = await Follow.findAll({
            where: { follower_id: iFollowIds, followed_id: userId },
            attributes: ["follower_id"]
        })
        const friendIds = mutualFollows.map(f => f.follower_id)

        if (friendIds.length === 0) return []

        // 3. Datos de los amigos con sus conteos
        const friends = await User.findAll({
            where: { id: friendIds },
            attributes: ["id", "username", "avatar", "biography"]
        })

        // 4. Conteos de seguidores/siguiendo para cada amigo
        const followersCountMap = {}
        const followingCountMap = {}
        await Promise.all(friendIds.map(async (id) => {
            followersCountMap[id] = await Follow.count({ where: { followed_id: id } })
            followingCountMap[id] = await Follow.count({ where: { follower_id: id } })
        }))
 
        // 5. Favoritos de todos los amigos en UNA sola query (evita el problema N+1)
        const favoriteLists = await List.findAll({
            where: { user_id: friendIds, is_default: 1 },
            include: [{
                model: ListItem,
                as: "list_items",
                limit: 5,
                include: [{
                    model: ContentCache,
                    as: "tmdb",
                    attributes: ["tmdb_id", "title", "poster_path", "media_type"]
                }]
            }]
        })

        // Mapa: user_id → items de favoritos
        const favoritesMap = {}
        favoriteLists.forEach(list => {
            favoritesMap[list.user_id] = list.list_items.map(item => item.tmdb)
        })

        // 6. Construimos la respuesta final
        return friends.map(friend => ({
            id: friend.id,
            username: friend.username,
            avatar: friend.avatar,
            biography: friend.biography,
            followers_count: followersCountMap[friend.id] || 0,
            following_count: followingCountMap[friend.id] || 0,
            favorites: favoritesMap[friend.id] || []
        }))
    }

    async getFollowersNotFollowing(userId) {
        // 1. IDs de los que me siguen
        const followers = await Follow.findAll({
            where: { followed_id: userId },
            attributes: ["follower_id"]
        })
        const followerIds = followers.map(f => f.follower_id)
 
        if (followerIds.length === 0) return []
 
        // 2. IDs de los que yo sigo
        const iFollow = await Follow.findAll({
            where: { follower_id: userId },
            attributes: ["followed_id"]
        })
        const iFollowIds = iFollow.map(f => f.followed_id)
 
        // 3. Filtramos: me siguen pero yo no les sigo
        const notFollowingIds = followerIds.filter(id => !iFollowIds.includes(id))
 
        if (notFollowingIds.length === 0) return []
 
        const users = await User.findAll({
            where: { id: notFollowingIds },
            attributes: ["id", "username", "avatar", "biography"]
        })
 
        return users
    }
}

module.exports = new FollowService()
