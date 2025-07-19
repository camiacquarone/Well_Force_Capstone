const prisma = require("../models/prisma-client");

// Grab all snacks
exports.getAllSnacks = async (req, res) => {
  try {
    const snacks = await prisma.snacks.findMany({
      include: {
        nutritional_info: true,
        dietary_preferences: true
      }
    });
    res.json(snacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch snacks" });
  }
};
