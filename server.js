const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conexão com o MongoDB estabelecida com sucesso.");
});

const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

module.exports = app;
