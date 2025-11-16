const express = require("express");
const dbConnection = require("./config/database");
require("dotenv").config();

const router = require("./src/routes/route");

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware pour lire JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running successfully ..");
});

// Routes
app.use("/api/todos", router);

if (process.env.NODE_ENV === "development") {
  console.log(`mode: ${process.env.NODE_ENV}`);
}

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});