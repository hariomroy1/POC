const express = require("express");
const dotenv = require("dotenv");
const app = require("./app.js");

const db = require("./DataLayer/models");

dotenv.config({
  path: "./.env",
});

//const app = express();
const port = process.env.PORT || 3000;

//------------ for sequelize
const { sequelize } = require("./DataLayer/database/sequelize.js");

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
//--------------------------------------------------------------------------------
db.sequelize.sync().then((req) => {
  app.listen(port, () => {
    console.log(`Server is running on Port :${port}`);
  });
});
