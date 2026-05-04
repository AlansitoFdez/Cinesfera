const express = require('express')
const router = express.Router()
const followController = require('../controllers/followController')

router.post('/:username', followController.followUser)
router.delete("/:username", followController.unfollowUser)
router.get("/status/:username", followController.getFollowStatus)

router.get("/friends", followController.getFriends)

module.exports = router