const prisma = require("../models/prisma-client");

const getAllMeals = async (req, res) => {
  try {
    const meals = await prisma.Meals.findMany({
      include: {
        nutritional_information: true,
        dietary_preferences: true,
      },
    });
    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
};

const getPersonalizedMeals = async (req, res) => {
  const clerkId = req.query.userId || req.auth?.userId;
  if (!clerkId) return res.status(400).json({ error: "Missing userId" });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, dietary_pref: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const meals = await prisma.meal.findMany({
      where: {
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

// 3. Log meal
const logMeal = async (req, res) => {
  const { userId: clerkId, mealId, date, count } = req.body;

  if (!clerkId || !mealId || !date || typeof count !== "number") {
    return res
      .status(400)
      .json({ error: "Missing or invalid body parameters" });
  }

  const parsedMealId = parseInt(mealId);
  if (isNaN(parsedMealId)) {
    return res.status(400).json({ error: "Invalid mealId" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const internalUserId = user.id;

    const meal = await prisma.meals.findUnique({ where: { id: parsedMealId } });
    if (!meal) return res.status(404).json({ error: "Meal not found" });

    const existingLog = await prisma.mealLog.findUnique({
      where: {
        userId_mealId_date: {
          userId: internalUserId,
          mealId: parsedMealId,
          date: new Date(date),
        },
      },
    });

    const updatedLog = existingLog
      ? await prisma.mealLog.update({
          where: {
            userId_mealId_date: {
              userId: internalUserId,
              mealId: parsedMealId,
              date: new Date(date),
            },
          },
          data: {
            count: { increment: count },
          },
        })
      : await prisma.mealLog.create({
          data: {
            userId: internalUserId,
            mealId: parsedMealId,
            date: new Date(date),
            count,
          },
        });

    res.json(updatedLog);
  } catch (err) {
    console.error("❌ Meal log failed:", err.message, err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Get meal count
const getMealCount = async (req, res) => {
  const { userId: clerkId, mealId, date } = req.query;
  if (!clerkId || !mealId || !date) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    // 🧠 Convert Clerk ID to internal user ID (INT)
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const log = await prisma.mealLog.findFirst({
      where: {
        userId: user.id, // ✅ use numeric ID
        mealId: parseInt(mealId),
        date: new Date(date),
      },
    });

    res.json({ count: log?.count || 0 });
  } catch (error) {
    console.error("❌ Failed to fetch meal count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 5. Total calories for meals for a given date
const getTotalMealCalories = async (req, res) => {
  const { userId, date } = req.query;

  try {
    const logs = await prisma.mealLog.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      include: {
        meal: {
          include: { nutritional_information: true },
        },
      },
    });

    const totalCalories = logs.reduce((sum, log) => {
      const cals =
        parseInt(log.meal?.nutritional_information?.[0]?.calories) || 0;
      return sum + log.count * cals;
    }, 0);

    res.json({ totalCalories });
  } catch (err) {
    res.status(500).json({ error: "Failed to get meal calories." });
  }
};

const getCombinedCalories = async (req, res) => {
  const { userId: clerkId } = req.query;

  if (!clerkId) return res.status(400).json({ error: "Missing userId" });

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const dbUserId = user.id;

    const snackLogs = await prisma.snackLog.findMany({
      where: { userId: dbUserId },
      include: {
        snack: {
          include: { nutritional_info: true },
        },
      },
    });

    const mealLogs = await prisma.mealLog.findMany({
      where: { userId: dbUserId },
      include: {
        meal: {
          include: { nutritional_information: true },
        },
      },
    });

    const snackByDay = {};
    for (const log of snackLogs) {
      const date = log.date.toISOString().split("T")[0];
      const calories =
        parseInt(log.snack?.nutritional_info?.[0]?.calories) || 0;
      snackByDay[date] = (snackByDay[date] || 0) + calories * log.count;
    }

    const mealByDay = {};
    for (const log of mealLogs) {
      const date = log.date.toISOString().split("T")[0];
      const calories =
        parseInt(log.meal?.nutritional_information?.[0]?.calories) || 0;
      mealByDay[date] = (mealByDay[date] || 0) + calories * log.count;
    }

    const combined = { ...snackByDay };
    for (const [date, cal] of Object.entries(mealByDay)) {
      combined[date] = (combined[date] || 0) + cal;
    }

    res.json(combined);
  } catch (err) {
    console.error("❌ Error in getCombinedCalories:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = {
  getAllMeals,
  getPersonalizedMeals,
  logMeal,
  getMealCount,
  getTotalMealCalories,
  getCombinedCalories,
};
