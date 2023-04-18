// Require packages
const express = require("express");

// Require files
const CONFIG = require("./config/config");
const userRouter = require("./routes/authRoute");
const loanRouter = require("./routes/loanRoute");

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

app.use("/api/v1", userRouter);
app.use("/api/v1", loanRouter);

module.exports = app;
