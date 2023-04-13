require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  TOKEN_KEY: process.env.TOKEN_KEY,
  MONGODB_URL: process.env.MONGODB_URL
};

module.exports = CONFIG;
