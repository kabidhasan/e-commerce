const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const axios = require("axios");

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    const payLoad = { email: "admin@gmail.com", role: "admin" };
    if (email === "admin@gmail.com" && password === "admin") {
      const token = sign(payLoad, SECRET);
      return res.status(200).cookie("token", token, { httpOnly: true }).json({
        email: payLoad.email,
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
      msg: "You are admin. Your place.",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
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

exports.approveOrderById = async (req, res) => {
  try {
    const { order_id } = req.body;

    //await db.query("BEGIN");
    // getting order details
    const selectQuery = 'SELECT * FROM "order" WHERE order_id = $1';
    const result = await db.query(selectQuery, [order_id]);
    const orderDetails = result.rows[0];
    orderDetails.amount = 0.9 * parseFloat(orderDetails.amount);
    console.log("Hello");
    console.log(orderDetails.amount);

    if (orderDetails.approved == true) {
      throw new Error("Order already approved");
    }

    const payload = { order_id, SECRET };
    const token = sign(payload, SECRET);

    //console.log("good1");
    const externalApiUrl = "http://localhost:4000/supplier/createOrder";
    await axios.post(externalApiUrl, orderDetails, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
    });
    const updateQuery =
      'UPDATE "order" SET approved = true WHERE order_id = $1';
    await db.query(updateQuery, [order_id]);
    console.log("good2");

    //await db.query("COMMIT");

    res.status(200).json({
      success: true,
      msg: "Order approved and forwarded to supplier.",
    });
  } catch (error) {
    //await db.query("ROLLBACK");

    res.status(500).json({
      success: false,
      msg: "Error approving order or sending",
      error: error.message,
    });
  }
};

exports.paySupplier = async (req, res) => {
  console.log(`payment req recieved`);
  try {
    console.log(408);
    const { order_id } = req.body;
    //await db.query("BEGIN");

    // Check if the order has already been shipped

    const checkShippedQuery =
      'SELECT shipped, amount FROM "order" WHERE order_id = $1';
    const checkShippedResult = await db.query(checkShippedQuery, [order_id]);
    
    if (!checkShippedResult.rows.length) {
      //await db.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    const isShipped = checkShippedResult.rows[0].shipped;

    const amount = checkShippedResult.rows[0].amount * 0.9;

    const sendingAmount = parseFloat(amount);

    

    if (isShipped) {
      console.log(413);
      //await db.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        msg: "Order has already been shipped",
      });
    }
    console.log("about to go bank");
    // Send POST request to external bank API
    console.log("11111111111");
    const bankApiUrl = "http://localhost:5000/bank/transaction";
    const sender_acc = 111111;
    const receiver_acc = 555555;
    const bankApiResponse = await axios.post(bankApiUrl, {
      sender_acc: sender_acc,
      receiver_acc: receiver_acc,
      amount: sendingAmount,
    });
    console.log(416);
    if (bankApiResponse.data.success) {
      await db.query('update "order" set shipped= true where order_id = $1',[order_id]);
      console.log("Money");
      return res.status(200).json({
        success: true,
        msg: "Payment to suplier pocessed successfully",
      });
      //await db.query("COMMIT");
    } else {
      //await db.query("ROLLBACK");
      return res.status(500).json({
        success: false,
        msg: "Payment to supplier failed",
      });
    }
  } catch (error) {
    //  await db.query("ROLLBACK");
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
