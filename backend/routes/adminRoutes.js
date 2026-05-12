const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController.js")

router.get("/users", adminController.getUsers)
router.patch("/users/:id/ban", adminController.banUser)

module.exports = router