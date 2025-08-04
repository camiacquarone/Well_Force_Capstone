const express = require("express");
const router = express.Router();
const {
  getAllMeals,
  getPersonalizedMeals,
  logMeal,
  getMealCount,
  getTotalMealCalories,
  getCombinedCalories, 
} = require("../controllers/meal-controller");

router.get("/", getAllMeals);
router.get("/personalized", getPersonalizedMeals);
router.post("/log", logMeal);
router.get("/log/count", getMealCount);
router.get("/log/totalCalories", getTotalMealCalories);
router.get("/log/totals", getCombinedCalories); 

module.exports = router;