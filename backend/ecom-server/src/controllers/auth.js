const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const axios = require("axios");

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
    const { email, password, address, name } = req.body;
    hashedPassword = await hash(password, 10);
    await db.query("INSERT INTO user_info (email, name, password, address) values ($1, $2, $3, $4)", [
      email,
      name,
      hashedPassword,
      address
    ]);
   
    await db.query(
      "INSERT INTO cart(email) values ($1)",
      [email]
    );
    return res.status(201).json({
      success: "true",
      msg: "User registartion successful",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = req.user;
    console.log(req.user);
    let payload = {
      email: user.email,
    };
    const token = await sign(payload, SECRET);
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      msg: "Logged in successfully",
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

exports.setPaymentInfo = async (req, res) => {
  try {
    const { email } = req.user;
    const query = "SELECT email FROM payment_info WHERE email = $1";
    const result = await db.query(query, [email]);

    if (result.rows.length) {
      return res.status(500).json({
        success: false,
        msg: "Payment info already set for this account",
      });
    }

    // Verify payment info using the other server's API

    const { acc_no, pin } = req.body; // Assuming you're sending acc_no and pin in the request body

    const verifyBankInfoResponse = await axios.get(
      "http://localhost:5000/bank/verifyBankInfo",
      {
        params: {
          acc_no: acc_no,
          pin: pin,
        },
      }
    );

    if (verifyBankInfoResponse.data.success) {
      const insertQuery =
        "INSERT INTO payment_info (email, bank_acc) VALUES ($1, $2)";
      await db.query(insertQuery, [email, acc_no]);

      return res.status(200).json({
        success: true,
        msg: "Payment info verified and set successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "Failed to verify payment info",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error while verifying payment info",
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
