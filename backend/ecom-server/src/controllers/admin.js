const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");


exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    const payLoad = { email: "admin@gmail.com", role: "admin" };
    if (email === "admin@gmail.com" && password === "admin") {
      const token = sign(
        payLoad,
        SECRET
      );
      return res.status(200).cookie("token", token, { httpOnly: true }).json({
        success: true,
        msg: "Logged in successfully",
      });
    }
    return res.status(401).json({
      success: false,
      msg: "Invalid credentials",
    });
    //res.send("Admin test route");
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "An error occurred",
      error: error.message,
    });
  }
};

exports.adminProtected = async (req, res) => {
  try {
    return res.status(200).json({
      "msg": "You are admin. Your place."
    })
  } catch (error) {
    return res.status(500).json({
      "msg": error.message
    });
  }
}

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

exports.getAllOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM "order"';
    const orders = await db.query(query);

    res.status(200).json({
      success: true,
      orders: orders.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllApprovedOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM "order" WHERE approved = true';
    const approvedOrders = await db.query(query);

    res.status(200).json({
      success: true,
      approvedOrders: approvedOrders.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllPendingOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM "order" WHERE approved = false';
    const pendingOrders = await db.query(query);

    res.status(200).json({
      success: true,
      pendingOrders: pendingOrders.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

