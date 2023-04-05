require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  TOKEN_KEY: process.env.TOKEN_KEY,
};

module.exports = CONFIG;
