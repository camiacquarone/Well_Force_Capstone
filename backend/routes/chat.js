const express = require("express");
const router = express.Router();
const axios = require("axios");
const prisma = require("../models/prisma-client");


router.post("/chat", async (req, res) => {
  // The front-end now only needs to send the user's question
  const { userQuestion } = req.body;

  try {
    // 1. Fetch all meals from the database using Prisma
    const allMeals = await prisma.meals.findMany({
      include: {
        nutritional_information: true,
        dietary_preferences: true,
      },
    });

    // 2. Fetch all snacks from the database using Prisma
    const allSnacks = await prisma.snacks.findMany({
      include: {
        nutritional_info: true,
        dietary_preferences: true,
      },
    });

    // --- Start of Prompt Construction Logic ---

    // Define the system's role (B-Well Astro) and instructions
    const systemPrompt = `
You are B-Well Astro. A bee health life coach helping employees navigate how to be healthy during work.
Give general health advice but when asked to give advice on food, recommend meals and snacks from the "Available Meals and Snacks" list provided below.
Keep your responses to 200 characters so the user does not have to spend time reading, get straight to the point.
`;

    // Format the list of all available meals and snacks
    const availableFoods = [
      ...allMeals.map((meal) => {
        const nutri = meal.nutritional_information[0] || {};
        return `Meal: ${meal.name} from ${meal.restaurant_name} - ${nutri.calories ?? "?"} kcal, ${nutri.protein ?? "?"}g protein. Dietary Tags: ${meal.dietary_preferences.map(dp => dp.name).join(', ')}`;
      }),
      ...allSnacks.map((snack) => {
        const nutri = snack.nutritional_info[0] || {};
        return `Snack: ${snack.name} - ${nutri.calories ?? "?"} kcal, ${nutri.protein ?? "?"}g protein. Wellness Categories: ${snack.wellness_category.join(', ')}`;
      })
    ].join('\n');

    // Combine everything into a single, comprehensive prompt
    const finalPrompt = `
${systemPrompt}

Available Meals and Snacks:
${availableFoods}

---

User's Question:
${userQuestion}
`;
    // --- End of Prompt Construction Logic ---

    console.log("Sending prompt to OpenAI:", finalPrompt);

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: finalPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ response: openaiRes.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message);
    res.status(500).json({ response: "OpenAI API error." });
  }
});

module.exports = router;