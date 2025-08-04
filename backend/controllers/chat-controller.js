const prisma = require("../models/prisma-client");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const { getAuth } = require("@clerk/express");

exports.getPersonalizedMeals = async (req, res) => {
  console.log("✅ Personalized meal route was hit!");

  const { userId: clerkId } = req.auth;
  console.log("🔍 Searching user with clerkId:", clerkId);

  try {
    if (!clerkId) {
      const meals = await prisma.meals.findMany();
      return res.json({ meals });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        dietary_pref: true,
        goals: true,
      },
    });
    console.log("🧪 Checking user:", user);
    console.log("🥗 Dietary prefs:", user?.dietary_pref);
    console.log("🎯 Goals:", user?.goals);

    if (!user || (!user.dietary_pref.length && !user.goals.length)) {
      const meals = await prisma.meals.findMany();
      return res.json({ meals });
    }

    const meals = await prisma.meals.findMany({
      include: {
        nutritional_information: true,
        dietary_preferences: true,
      },
    });

    const systemPrompt = `
You are a wellness nutrition expert. Based on a user's health preferences, suggest the top 5 meals from a list that best support their goals.
Only return a JSON array of meal names. No numbers, no restaurant names, no formatting — just strings of meal names in an array without the name of the restaurant. example ('Harverst bowl')
`;

    const userPrompt = `
User Preferences:
- Dietary Preferences: ${
      user.dietary_pref.map((p) => p.name).join(", ") || "None"
    }
- Wellness Goals: ${user.goals.map((g) => g.title).join(", ") || "None"}

Available Meals:
${meals
  .map((meal) => {
    const nutri = meal.nutritional_information[0] || {};
    return `${meal.name} (${meal.restaurant_name}) - ${
      nutri.calories ?? "?"
    } kcal, ${
      nutri.protein ?? "?"
    }g protein, Dietary Tags: ${meal.dietary_preferences
      .map((dp) => dp.name)
      .join(", ")}`;
  })
  .join("\n")}
`;

    console.log("📤 Sending prompt to GPT...");

    let gptContent;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7, 
      });

      gptContent = completion.choices[0].message.content;
      console.log("🤖 GPT response:", gptContent);
    } catch (err) {
      console.error("🔥 GPT call failed:", err);
      return res.status(500).json({ error: "GPT call failed." });
    }

    let selectedMealNames;

    try {
      selectedMealNames = JSON.parse(gptContent);
    } catch (err) {
      console.warn("⚠️ GPT JSON parse failed. Trying fallback...");
      const match = gptContent.match(/\[.*?\]/);
      if (match) {
        try {
          selectedMealNames = JSON.parse(match[0]);
        } catch (innerErr) {
          console.error("❌ Still couldn't parse GPT response:", gptContent);
          return res.status(500).json({ error: "Invalid GPT output format." });
        }
      } else {
        return res.status(500).json({ error: "GPT output not parsable." });
      }
    }

    if (!Array.isArray(selectedMealNames) || selectedMealNames.length === 0) {
      console.error("❌ GPT returned empty or invalid meal list.");
      return res
        .status(500)
        .json({ error: "GPT did not return any valid meals." });
    }

    console.log("✅ GPT parsed meal names:", selectedMealNames);

    const normalize = (str) =>
      str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "");

    // Match and preserve GPT order
    const topMeals = selectedMealNames
      .map((name) => {
        return meals.find((meal) => normalize(meal.name) === normalize(name));
      })
      .filter(Boolean);

    console.log(
      "🍽 Final matched meals:",
      topMeals.map((m) => m.name)
    );

    res.json({ meals: topMeals });
  } catch (err) {
    console.error("🔥 Error in personalized meal route:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
