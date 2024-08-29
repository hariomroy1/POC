const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use(cors());

// Now import routes
const router = require("./routes/router");

app.use("/api", router);

module.exports = app;
