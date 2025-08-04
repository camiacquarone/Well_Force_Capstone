const express = require("express");
const router = express.Router();
const snackController = require("../controllers/snack-controller");
const { getDailyCalories } = require("../controllers/snack-controller");

//get all meals
router.get("/", snackController.getAllSnacks);
router.post("/log", snackController.logSnack);
router.get("/log/count", snackController.getSnackCount);
router.get("/log/total", snackController.getTotalCalories);
router.get("/log/totals", snackController.getDailyCalories);
router.get("/log/daily", getDailyCalories);

module.exports = router;
