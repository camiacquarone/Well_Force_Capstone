const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
console.log("API key loaded:", process.env.OPENAI_API_KEY);
const chatRoutes = require("./routes/chat.js");
const userRoutes = require("./routes/user-routes.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/api", chatRoutes); // This mounts /api/chat

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
