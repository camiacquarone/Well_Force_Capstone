const express = require ('express')
const router = express.Router()
const controller = require("../controllers/snack-controller.js")

// get all meals
router.get("/", controller.getAllSnacks)

module.exports = router