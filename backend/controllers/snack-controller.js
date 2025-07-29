const prisma = require("../models/prisma-client");

// Grab all snacks
exports.getAllSnacks = async (req, res) => {
  try {
    const snacks = await prisma.snacks.findMany({
      include: {
        nutritional_info: true,
        dietary_preferences: true,
      },
    });
    res.json(snacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch snacks" });
  }
};

exports.logSnack = async (req, res) => {
  try {
    const { userId: clerkId, snackId, date, count = 1 } = req.body;

    if (!date || new Date(date).toString() === "Invalid Date") {
      console.error("Invalid date received:", date);
      return res.status(400).json({ error: "Invalid or missing date." });
    }

    // 1. Find internal numeric user ID by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId }, // clerkId is a string
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const internalUserId = user.id;

    // 2. Proceed with using internal numeric ID
    const existing = await prisma.snackLog.findFirst({
      where: {
        userId: internalUserId,
        snackId,
        date: new Date(date),
      },
    });

    if (existing) {
      const updated = await prisma.snackLog.update({
        where: { id: existing.id },
        data: { count: { increment: count } },
      });
      return res.json(updated);
    }

    const newLog = await prisma.snackLog.create({
      data: {
        userId: internalUserId,
        snackId,
        date: new Date(date),
        count,
      },
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSnackCount = async (req, res) => {
  const { userId: clerkId, snackId, date } = req.query;

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const log = await prisma.snackLog.findFirst({
      where: {
        userId: user.id,
        snackId: parseInt(snackId),
        date: new Date(date),
      },
    });

    res.json({ count: log?.count || 0 });
  } catch (err) {
    console.error("Failed to fetch snack count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTotalCalories = async (req, res) => {
  const { userId: clerkId, date } = req.query;

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const logs = await prisma.snackLog.findMany({
      where: {
        userId: user.id,
        date: new Date(date),
      },
      include: {
        snack: { include: { nutritional_info: true } },
      },
    });

    const total = logs.reduce((sum, log) => {
      const calories = log.snack.nutritional_info[0]?.calories || 0;
      return sum + calories * log.count;
    }, 0);

    res.json({ totalCalories: total });
  } catch (err) {
    console.error("Failed to fetch total calories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDailyCalories = async (req, res) => {
  const { userId: clerkId } = req.query;

  if (!clerkId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const logs = await prisma.snackLog.findMany({
      where: { userId: user.id },
      include: {
        snack: {
          include: {
            nutritional_info: true,
          },
        },
      },
    });

    const dailyTotals = {};

    for (const log of logs) {
      const rawDate = log.date;
      const date = rawDate.toISOString().split("T")[0];


      const calories = parseInt(log.snack.nutritional_info?.[0]?.calories) || 0;
      const total = calories * log.count;

      dailyTotals[date] = (dailyTotals[date] || 0) + total;
    }

    return res.json(dailyTotals);
  } catch (error) {
    console.error("Error fetching daily calories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
