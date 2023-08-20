const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const axios = require("axios");

exports.getAllItems = async (req, res) => {
  try {
    const { item_id } = req.query;
    const query = "SELECT * FROM items";
    const result = await db.query(query);

    res.status(200).json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  const { email } = req.user;

  try {
    console.log("getCart called");
    const cartQuery = `
      SELECT * FROM cart
      WHERE email = $1
    `;

    const cartResult = await db.query(cartQuery, [email]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found for the user",
      });
    }

    const cartItems = {
      item1: cartResult.rows[0].item1,
      item2: cartResult.rows[0].item2,
      item3: cartResult.rows[0].item3,
    };

    res.status(200).json({
      cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
