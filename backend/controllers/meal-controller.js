const prisma = require("../models/prisma-client")

//grab all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await prisma.Meals.findMany({
      include: {
        nutritional_information: true,
        dietary_preferences: true
      }
    });
    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
}
