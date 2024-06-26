const { config } = require("dotenv");

config();

module.exports = {
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
  ECOM_BANK_ACCOUNT: process.env.ECOM_BANK_ACC
};
