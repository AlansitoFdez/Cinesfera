const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

router.post("/", reviewController.createReview)
router.get("/:tmdb_id/:media_type", reviewController.getReviewsByContent)
router.delete("/:id", reviewController.deleteReview)
router.put("/:id", reviewController.editReview)

module.exports = router
