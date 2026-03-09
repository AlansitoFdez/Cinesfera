const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new Error("Solo se permiten imágenes"), false)
        }
    },
})

router.get("/", userController.getAllUsers)

router.delete("/me", userController.deleteAccount)

router.put("/me/password", userController.changePassword)

router.put("/me", upload.single("avatar"), userController.updateProfile)

module.exports = router