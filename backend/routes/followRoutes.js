const express = require('express')
const router = express.Router()
const followController = require('../controllers/followController')

// ── Rutas específicas primero ─────────────────────────────────────────────────
router.get("/friends", followController.getFriends)
router.get("/followers", followController.getFollowersNotFollowing)
router.get("/discover", followController.getSuggestedUsers)
router.get("/status/:username", followController.getFollowStatus)

// ── Rutas dinámicas al final ──────────────────────────────────────────────────
router.post('/:username', followController.followUser)
router.delete("/:username", followController.unfollowUser)

module.exports = router