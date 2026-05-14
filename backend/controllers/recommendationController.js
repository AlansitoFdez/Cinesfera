const recommendationService = require("../services/recommendationService")
const Respuesta = require("../utils/respuesta")
const { logMensaje } = require("../utils/logger")

class RecommendationController {

    async getRecommendations(req, res) {
        try {
            const recommendations = await recommendationService.getRecommendations(req.user.sub)
            return res.status(200).json(Respuesta.exito(recommendations, "Recomendaciones obtenidas correctamente"))
        } catch (error) {
            logMensaje(error)
            if (error.isControlled) {
                return res.status(error.status || 400).json(Respuesta.error(null, error.message))
            }
            return res.status(500).json(Respuesta.error(null, "Error al obtener recomendaciones"))
        }
    }
}

module.exports = new RecommendationController()