const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController.js")

router.get("/users", adminController.getUsers)
router.patch("/users/:id/ban", adminController.banUser)
router.patch("/users/:id/role", adminController.changeRole)
router.delete("/users/:id", adminController.deleteUser)

router.get("/reviews", adminController.getReviews)
router.delete("/reviews/:id", adminController.deleteReview)

router.get("/stats", adminController.getStats)

module.exports = router