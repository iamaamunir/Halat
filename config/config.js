require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGODB_URL: process.env.MONGODB_URL,
};

module.exports = CONFIG;
