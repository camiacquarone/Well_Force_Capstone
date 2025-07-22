const express = require ('express')
const router = express.Router()
const controller = require("../controllers/meal-controller.js")

// get all meals
router.get("/", controller.getAllMeals)
// In meal-routes.js
router.get("/personalized", controller.getPersonalizedMeals);


module.exports = router