const prisma = require('../models/prisma-client');
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const { getAuth } = require("@clerk/express");

exports.getPersonalizedMeals = async (req, res) => {
  console.log("✅ Personalized meal route was hit!");

  // 🔐 Get Clerk user ID from auth context
  const { userId: clerkId } = req.auth;

  try {
    if (!clerkId) {
      // No user logged in — return all meals
      const meals = await prisma.meals.findMany();
      return res.json({ meals });
    }

    // Get user and their preferences/goals by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        dietary_pref: true,
        goals: true,
      },
    });

    if (!user || (!user.dietary_pref.length && !user.goals.length)) {
      // User has no preferences/goals — return all meals
      const meals = await prisma.meals.findMany();
      return res.json({ meals });
    }

    // Get all meals with nutritional and dietary info
    const meals = await prisma.meals.findMany({
      include: {
        nutritional_information: true,
        dietary_preferences: true,
      },
    });

    const systemPrompt = `
You are a wellness nutrition expert. Based on a user's health preferences, suggest the top 5 meals from a list that best support their goals.
Only return a JSON array of meal names without restaurant names or extra text.
`;

    const userPrompt = `
User Preferences:
- Dietary Preferences: ${user.dietary_pref.map(p => p.name).join(", ") || "None"}
- Wellness Goals: ${user.goals.map(g => g.title).join(", ") || "None"}

Available Meals:
${meals.map((meal, i) => {
  const nutri = meal.nutritional_information[0] || {};
  return `#${i + 1}: ${meal.name} (${meal.restaurant_name}) - ${nutri.calories ?? "?"} kcal, ${nutri.protein ?? "?"}g protein, Dietary Tags: ${meal.dietary_preferences.map(dp => dp.name).join(", ")}`;
}).join("\n")}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const gptContent = completion.choices[0].message.content;
    console.log("GPT response:", gptContent);

    let selectedMealNames;
    try {
      selectedMealNames = JSON.parse(gptContent);
    } catch (err) {
      console.error("Failed to parse GPT response:", gptContent);
      return res.status(500).json({ error: "GPT returned unexpected output." });
    }

    const topMeals = meals.filter(meal =>
      selectedMealNames.includes(meal.name)
    );

    res.json({ meals: topMeals });
  } catch (err) {
    console.error("Error in personalized meal route:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
