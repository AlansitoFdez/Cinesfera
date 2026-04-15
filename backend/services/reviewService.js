const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const Review = models.reviews
const ContentCache = models.contentCache
const User = models.users

class ReviewService {

    async createReview(userId, { tmdb_id, media_type, rating, comment, title, poster_path, vote_average }) {

        // Paso 1 — Insertar en content_cache si no existe
        await ContentCache.findOrCreate({
            where: { tmdb_id, media_type },
            defaults: { title, poster_path, vote_average }
        })

        let review = await Review.findOne({
            where: { user_id: userId, tmdb_id, media_type }
        })

        if (review) {
            throw new Error("Ya has reseñado este contenido")
        } else {
            review = await Review.create({
                user_id: userId,
                tmdb_id,
                media_type,
                rating,
                comment
            })
        }

        return review
    }

    async getReviewsByContent(tmdb_id, media_type) {
        const reviews = await Review.findAll({
            where: { tmdb_id, media_type },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "username", "avatar"]
                }
            ]
        })
        return reviews
    }

    async deleteReview(reviewId, userId) {
        const review = await Review.findByPk(reviewId)
        if (!review) throw new Error("Reseña no encontrada")
        if (review.user_id !== userId) throw new Error("No tienes permiso para eliminar esta reseña")
        await review.destroy()
    }

    async editReview(reviewId, userId, { rating, comment }) {
        const review = await Review.findByPk(reviewId)
        if (!review) throw new Error("Reseña no encontrada")
        if (review.user_id !== userId) throw new Error("No tienes permiso para editar esta reseña")
        review.rating = rating
        review.comment = comment
        await review.save()
        return review
    }
}

module.exports = new ReviewService()