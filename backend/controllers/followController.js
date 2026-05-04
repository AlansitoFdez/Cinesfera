const { logMensaje } = require('../utils/logger.js')
const Respuesta = require('../utils/respuesta.js')
const followService = require('../services/followService.js')

class FollowController {

    async followUser(req, res) {
        try {
            const followerId = req.user.sub
            const { username } = req.params
            const result = await followService.followUser(followerId, username)
            return res.status(200).json(Respuesta.exito(result, "Ahora sigues a este usuario"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) return res.status(400).json(Respuesta.error(error.message))
            return res.status(500).json(Respuesta.error("Error al seguir al usuario"))
        }
    }

    async unfollowUser(req, res) {
        try {
            const followerId = req.user.sub
            const { username } = req.params
            const result = await followService.unfollowUser(followerId, username)
            return res.status(200).json(Respuesta.exito(result, "Has dejado de seguir a este usuario"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) return res.status(400).json(Respuesta.error(error.message))
            return res.status(500).json(Respuesta.error("Error al dejar de seguir al usuario"))
        }
    }

    async getFollowStatus(req, res) {
        try {
            const followerId = req.user.sub
            const { username } = req.params
            const result = await followService.getFollowStatus(followerId, username)
            return res.status(200).json(Respuesta.exito(result, "Estado obtenido"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) return res.status(400).json(Respuesta.error(error.message))
            return res.status(500).json(Respuesta.error("Error al obtener estado"))
        }
    }

    async getFriends(req, res) {
        try {
            const userId = req.user.sub
            const friends = await followService.getFriends(userId)
            return res.status(200).json(Respuesta.exito(friends, "Amigos obtenidos correctamente"))
        } catch (error) {
            logMensaje(error)
            return res.status(500).json(Respuesta.error("Error al obtener amigos"))
        }
    }
}

module.exports = new FollowController()
