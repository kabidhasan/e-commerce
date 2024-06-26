const { config } = require("dotenv");

config();

module.exports = {
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  CLIENT_URL: process.env.Client_URL,
  SERVER_URL: process.env.SERVER_URL,
};
