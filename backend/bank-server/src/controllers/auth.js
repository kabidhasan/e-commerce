const db = require("../db");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT user_id, email FROM users");
    return res.status(201).json(rows);
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, pin, address, name } = req.body;
    hashedPin = await hash(pin, 10);
    await db.query(
      "INSERT INTO bank_user (email, name, pin, address) values ($1, $2, $3, $4)",
      [email, name, hashedPin, address]
    );

    const query = `
      SELECT acc_no
      FROM bank_user
      WHERE email = $1
    `;
    const result = await db.query(query, [email]);
    const bank_acc = result.rows[0].acc_no;

    return res.status(201).json({
      success: "true",
      msg: "Bank user registartion successful",
      bank_acc: bank_acc,
    });

  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Bank e ashlam");

    let user = req.user;
    let payload = {
      acc_no: user.acc_no,
    };
    console.log("Bank e abar ashlam");

    const token = await sign(payload, SECRET);
    
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      email: user.email,
      acc_no: user.acc_no,
      success: true,
      msg: "Logged in successfully",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.protected = async (req, res) => {
  try {
    res.status(200).json({
      info: "protected info",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.verifyBankInfo = async (req, res) => {
  try {
    
    const { acc_no, pin } = req.query;
    
    console.log(acc_no);
    const query = "SELECT pin from bank_user where acc_no = $1";
    const result = await db.query(query, [acc_no]);

    if (!result.rows.length) {
      console.log("No row!");
      return res.status(401).json({
        success: false,
        msg: "Account number does not exist",
      });
    }

    const hashedPin = result.rows[0].pin;
    const verifyPin = await compare(pin, hashedPin);

    if (!verifyPin) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Pin.",
      });
    }

    res.status(201).json({
      success: true,
      msg: "Payment info verified.",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};
