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

exports.getPersonalizedMeals = async (req, res) => {
  const clerkId = req.query.userId || req.auth?.userId; // from query or Clerk auth

  if (!clerkId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, dietary_pref: true }, // select whatever you need
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Now use user.id (int) for any queries, example:
    const meals = await prisma.meal.findMany({
      where: {
        // Example: filter by user's dietary preferences
        dietary_preferences: {
          hasSome: user.dietary_pref.map((pref) => pref.name),
        },
      },
    });

    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
