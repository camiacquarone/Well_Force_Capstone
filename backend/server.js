const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
console.log("API key loaded:", process.env.OPENAI_API_KEY);
const chatRoutes = require("./routes/chat");
const mealRoutes = require("./routes/meal-routes.js");
const snackRoutes = require("./routes/snack-routes.js")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes); // This mounts /api/chat
app.use("/api/meals", mealRoutes); // This mounts api/meals
app.use("/api/snacks", snackRoutes);

app.get("/", (req, res) => {
  res.send("API is working.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});