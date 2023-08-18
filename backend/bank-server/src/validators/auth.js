const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

const pin = check("pin")
  .isLength(4)
  .withMessage("Secret Pin must be exactly 4 characters.");
const email = check("email")
  .isEmail()
  .withMessage("Please enter a valid email.");
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("select * from bank_user where email= $1", [
    value,
  ]);
  if (rows.length) {
    throw new Error("Email already exists.");
  }
});
const name = check("name").notEmpty().withMessage("Name is required.");

const address = check("address").notEmpty().withMessage("Address is required.");

const loginFieldsCheck = check("acc_no").custom(async (value, { req }) => {
  const user = await db.query("SELECT * FROM bank_user WHERE acc_no = $1", [value]);
  if (!user.rows.length) {
    throw new Error("Account number does not exist.");
  }

  const validPin= await compare(req.body.pin, user.rows[0].pin);

  if (!validPin) {
    throw new Error("Pin is invalid");
  }

  req.user = user.rows[0];
});
module.exports = {
  registrationValidation: [email, name, pin, emailExists, address],
  loginValidation: [loginFieldsCheck],
};
