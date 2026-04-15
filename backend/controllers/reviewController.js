const reviewService = require("../services/reviewService")
const Respuesta = require("../utils/respuesta")

class ReviewController {

    async createReview(req, res) {
        try {
            const review = await reviewService.createReview(req.user.sub, req.body)
            res.status(201).json(Respuesta.exito(review, "Reseña creada exitosamente"))
        } catch (error) {
            res.status(500).json(Respuesta.error("Error al crear la reseña"))
        }
    }

    async getReviewsByContent(req, res) {
        try {
            const reviews = await reviewService.getReviewsByContent(req.params.tmdb_id, req.params.media_type)
            res.status(200).json(Respuesta.exito(reviews, "Reseñas obtenidas exitosamente"))
        } catch (error) {
            res.status(500).json(Respuesta.error("Error al obtener las reseñas"))
        }
    }

    async deleteReview(req, res) {
        try {
            await reviewService.deleteReview(req.params.id, req.user.sub)
            res.status(200).json(Respuesta.exito(null, "Reseña eliminada exitosamente"))
        } catch (error) {
            res.status(500).json(Respuesta.error("Error al eliminar la reseña"))
        }
    }

    async editReview(req, res) {
        try {
            const review = await reviewService.editReview(req.params.id, req.user.sub, req.body)
            res.status(200).json(Respuesta.exito(review, "Reseña editada exitosamente"))
        } catch (error) {
            res.status(500).json(Respuesta.error("Error al editar la reseña"))
        }
    }
}

module.exports = new ReviewController()