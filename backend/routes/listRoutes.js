const express = require("express")
const router = express.Router()
const listController = require("../controllers/listController")

router.get("/", listController.getMyLists)
router.get("/dropdown/:tmdbId/:mediaType", listController.getListsForDropdown)
router.get("/user/:userId", listController.getPublicListsByUser)
router.post("/", listController.createList)

router.get("/:id", listController.getListDetail)
router.put("/:id", listController.updateList)
router.delete("/:id", listController.deleteList)
router.post("/:id/items/toggle", listController.toggleItem)

module.exports = router