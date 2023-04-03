// Require packages
const express = require("express");

// Require files
const CONFIG = require("./config/config");

// instantialize packages

const app = express();

// middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.statusCode(200).json({
    status: "success",
    message: "Welcome to Halat. Your No.1 loan app",
  });
});

module.exports = app;
