const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/", userController.getAllUsers)

router.delete("/me", userController.deleteAccount)

router.put("/me/password", userController.changePassword)

module.exports = router