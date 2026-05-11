const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const Review = models.reviews
const ContentCache = models.contentCache
const User = models.users

const controlledError = (message, status = 400) => {
    const err = new Error(message)
    err.isControlled = true
    err.status = status
    return err
}

class ReviewService {

    async createReview(userId, { tmdb_id, media_type, rating, comment, title, poster_path, vote_average }) {
        await ContentCache.findOrCreate({
            where: { tmdb_id, media_type },
            defaults: { title, poster_path, vote_average }
        })

        const existing = await Review.findOne({
            where: { user_id: userId, tmdb_id, media_type }
        })

        if (existing) throw controlledError("Ya has reseñado este contenido")

        const review = await Review.create({
            user_id: userId, tmdb_id, media_type, rating, comment
        })

        return review
    }

    async getReviewsByContent(tmdb_id, media_type) {
        return await Review.findAll({
            where: { tmdb_id, media_type },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "username", "avatar"]
            }]
        })
    }

    async deleteReview(reviewId, userId) {
        const review = await Review.findByPk(reviewId)
        if (!review) throw controlledError("Reseña no encontrada", 404)
        if (review.user_id !== userId) throw controlledError("No tienes permiso para eliminar esta reseña", 403)
        await review.destroy()
    }

    async editReview(reviewId, userId, { rating, comment }) {
        const review = await Review.findByPk(reviewId)
        if (!review) throw controlledError("Reseña no encontrada", 404)
        if (review.user_id !== userId) throw controlledError("No tienes permiso para editar esta reseña", 403)
        review.rating = rating
        review.comment = comment
        await review.save()
        return review
    }
}

module.exports = new ReviewService()