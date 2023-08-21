const db = require("../db");
const axios = require("axios");
const http = require("http");

const ECOM_BANK_ACCOUNT = require("../constants");

const ecom_acc = 111111;

exports.addToCart = async (req, res) => {
  const { email, item_id, count } = req.body;

  try {
    // if (email != req.user.email) {
    //   return res.status(401).json({
    //     message: "Unauthorized Attempt.",
    //   });
    // }
    console.log(email);
    const cartUpdateQuery = `
      UPDATE cart
      SET
          item1 = CASE WHEN $1 = 1 THEN item1 + $2 ELSE item1 END,
          item2 = CASE WHEN $1 = 2 THEN item2 + $2 ELSE item2 END,
          item3 = CASE WHEN $1 = 3 THEN item3 + $2 ELSE item3 END
      WHERE email = $3
    `;

    await db.query(cartUpdateQuery, [item_id, count, email]);
    console.log("done");
    res.status(200).json({
      success: true,
      message: `Item ${item_id} quantity increased by ${count} in the cart.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { email, item1, item2, item3, address } = req.body;
    console.log("I am here");
    // retriving name by email
    const nameResult = await db.query(
      "SELECT name FROM user_info WHERE email = $1",
      [email]
    );

    if (nameResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = nameResult.rows[0].name;

    // retriving address by email
    // const addressResult = await db.query(
    //   "SELECT address FROM user_info WHERE email = $1",
    //   [email]
    // );

    // if (addressResult.rows.length === 0) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // const address = addressResult.rows[0].address;

    const itemPrices = await db.query("SELECT item_id, item_price FROM items");
    const itemPriceMap = itemPrices.rows.reduce((map, item) => {
      map[item.item_id] = item.item_price;
      return map;
    }, {});

    // Calculate the total amount
    const amount =
      item1 * itemPriceMap[1] +
      item2 * itemPriceMap[2] +
      item3 * itemPriceMap[3];

    if (!amount) {
      return res.status(500).json({
        success: false,
        msg: "Cart is empty",
      });
    }

    // checking if he has already set the payment info
    const accNoQuery = "SELECT bank_acc FROM payment_info WHERE email = $1";
    accNoResult = await db.query(accNoQuery, [email]);
    if (!accNoResult.rows.length) {
      return res.status(500).json({
        success: false,
        msg: "Set payment info first",
      });
    }
    const acc_no = accNoResult.rows[0].bank_acc;
    console.log(acc_no);
    // Preparing transaction body

    const transactionData = {
      sender_acc: acc_no,
      receiver_acc: ecom_acc,
      amount: amount,
    };

    // Make a POST request to perform the transaction
    const transactionResponse = await axios.post(
      "http://localhost:5000/bank/transaction",
      transactionData
    );

    if (transactionResponse.data.success) {
      console.log(transactionResponse.data.msg);
    } else {
      console.log("Transaction failed:", transactionResponse.data.msg);
    }

    await db.query(
      `
      INSERT INTO "order" (name, email, address, item1, item2, item3, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [name, email, address, item1, item2, item3, amount]
    );
    console.log("heyyy");
    await db.query(
      `UPDATE cart SET item1 = 0, item2 = 0, item3 = 0 WHERE email = $1;`,
      [email]
    );

    res.status(200).json({
      success: true,
      msg: "Order placed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
