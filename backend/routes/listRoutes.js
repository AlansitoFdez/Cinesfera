const express = require("express")
const router = express.Router()
const listController = require("../controllers/listController")

router.get("/", listController.getMyLists)
router.get("/dropdown/:tmdbId/:mediaType", listController.getListsForDropdown)

module.exports = router