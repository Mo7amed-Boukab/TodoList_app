const express = require("express");
const dbConnection = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("Api is running successfully ..");
});

if(process.env.NODE_ENV === "developement") {
   console.log(`mode: ${process.env.NODE_ENV}`)
}

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
  });
});
