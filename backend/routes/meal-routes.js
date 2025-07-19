const express = require ('express')
const router = express.Router()
const controller = require("../controllers/meal-controller.js")

// get all meals
router.get("/", controller.getAllMeals)

module.exports = router