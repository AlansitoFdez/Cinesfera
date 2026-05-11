const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const rateLimit = require("express-rate-limit")
const { body } = require("express-validator")
const validate = require("../middlewares/validate")

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

const loginRules = [
    body("email")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
]

const signupRules = [
    body("username")
        .trim()
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3, max: 30 }).withMessage("El usuario debe tener entre 3 y 30 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("El usuario solo puede contener letras, números y guiones bajos"),
    body("email")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
]

router.post("/login", loginLimiter, loginRules, validate, authController.login)
router.post("/signup", signupRules, validate, authController.signup)
router.post("/logout", authController.logout)
router.get("/me", authController.me)

module.exports = router