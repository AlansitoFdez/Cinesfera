const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        datos: null,
        mensaje: "Demasiados intentos de inicio de sesión. Espera 15 minutos."
    }
})

router.post("/login", loginLimiter, authController.login)
router.post("/signup", authController.signup)
router.post("/logout", authController.logout)
router.get("/me", authController.me)

module.exports = router