const { GoogleGenerativeAI } = require("@google/generative-ai")
const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)
const tmdbService = require("./tmdbService")
const config = require("../config/config")

const genAI = new GoogleGenerativeAI(config.geminiApiKey)

const Review = models.reviews
const List = models.lists
const ListItem = models.listItems
const ContentCache = models.contentCache

class RecommendationService {

    async getRecommendations(userId) {
        // 1. Reseñas con puntuación alta (7-10)
        const highRatedReviews = await Review.findAll({
            where: { user_id: userId },
            include: [{ model: ContentCache, as: "tmdb", attributes: ["title", "media_type"] }],
            order: [["rating", "DESC"]],
            limit: 10
        })

        // 2. Reseñas con puntuación baja (1-4)
        const lowRatedReviews = await Review.findAll({
            where: { user_id: userId },
            include: [{ model: ContentCache, as: "tmdb", attributes: ["title", "media_type"] }],
            order: [["rating", "ASC"]],
            limit: 5
        })

        // 3. Favoritos del usuario
        const favoritesList = await List.findOne({
            where: { user_id: userId, is_default: true },
            attributes: ["id", "user_id", "name", "is_default"],
            include: [{
                model: ListItem,
                as: "list_items",
                include: [{ 
                    model: ContentCache, 
                    as: "tmdb", 
                    attributes: ["title", "media_type"] 
                }],
                limit: 10
            }]
        })

        // 4. Construir contexto para Gemini
        const liked = highRatedReviews
            .filter(r => r.rating >= 7)
            .map(r => `- ${r.tmdb?.title} (${r.tmdb?.media_type === "movie" ? "película" : "serie"}) → ${r.rating}/10`)
            .join("\n")

        const disliked = lowRatedReviews
            .filter(r => r.rating <= 4)
            .map(r => `- ${r.tmdb?.title} (${r.tmdb?.media_type === "movie" ? "película" : "serie"}) → ${r.rating}/10`)
            .join("\n")

        const favorites = favoritesList?.list_items
            ?.map(i => `- ${i.tmdb?.title} (${i.tmdb?.media_type === "movie" ? "película" : "serie"})`)
            .join("\n") || ""

        // 5. Si no hay suficiente contexto
        if (!liked && !favorites) {
            throw { status: 400, message: "Necesitas valorar o guardar contenido antes de recibir recomendaciones", isControlled: true }
        }

        const prompt = `Eres un experto recomendador de películas y series. Analiza los gustos del usuario y recomiéndale exactamente 5 títulos que no haya visto.

GUSTOS DEL USUARIO:
Le ha gustado mucho:
${liked || "Sin datos"}

Ha guardado como favoritos:
${favorites || "Sin datos"}

No le ha gustado:
${disliked || "Sin datos"}

INSTRUCCIONES:
- Recomienda exactamente 5 títulos
- Pueden ser películas o series
- NO recomiendes títulos que ya aparecen arriba
- Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin bloques de código
- Formato exacto:
[
  {
    "title": "Título en español o idioma original",
    "media_type": "movie" o "tv",
    "reason": "Explicación breve en español de por qué se lo recomiendas (máximo 2 frases)"
  }
]`

        // 6. Llamar a Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // 7. Parsear respuesta
        const recommendations = JSON.parse(text.trim())

        // 8. Buscar tmdb_id para cada recomendación
        const enriched = await Promise.allSettled(
            recommendations.map(async (rec) => {
                const results = await tmdbService.search(rec.title, rec.media_type)
                const match = results[0]
                if (!match) return null
                return {
                    tmdb_id: match.id,
                    title: match.title || match.name,
                    media_type: rec.media_type,
                    poster_path: match.poster_path,
                    reason: rec.reason
                }
            })
        )

        // Filtramos los que no se encontraron en TMDB
        return enriched
            .filter(r => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value)
    }
}

module.exports = new RecommendationService()