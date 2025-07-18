const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const chatRoutes = require("./routes/chat.js");
const userRoutes = require("./routes/user-routes.js");
const mealRoutes = require("./routes/meal-routes.js");


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", chatRoutes); 
app.use("/api/meals", mealRoutes); 
app.use("/api/snacks", snackRoutes);

app.get("/", (req, res) => {
  res.send("API is working.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});