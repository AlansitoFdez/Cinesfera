const express = require("express")
const router = express.Router()
const tmdbController = require("../controllers/tmdbController")

router.get("/trending", tmdbController.getTrending)
router.get("/popular/:type", tmdbController.getPopular)
router.get("/top_rated/:type", tmdbController.getTopRated)
router.get("/by_genre/:type/:id", tmdbController.getByGenre)

module.exports = router