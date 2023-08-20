const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const axios = require("axios");

exports.createOrder = async (req, res) => {
    try {
    console.log("good1");
    const { order_id, name, email, address, item1, item2, item3, amount } = req.body;
      
    const insertQuery = `
      INSERT INTO supplier_order (order_id, name, email, address, item1, item2, item3, amount)
      VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
      RETURNING order_id;
    `;

    const result = await db.query(insertQuery, [
      order_id,
      name,
      email,
      address,
      item1,
      item2,
      item3,
      amount,
    ]);

    const orderId = result.rows[0].order_id;

    res.status(201).json({
      success: true,
      msg: "Order created successfully",
      order_id: orderId,
    });
    } catch (error) {
    console.log("problem");
    res.status(500).json({
      success: false,
      msg: "Error creating order",
      error: error.message,
    });
  }
};

exports.shipOrder = async (req, res) => {
  const { order_id } = req.body;

  try {
    await db.query("BEGIN");

    // Check if the order exists and is not already shipped
    const orderQuery =
      "SELECT * FROM supplier_order WHERE order_id = $1 FOR UPDATE";
    const orderResult = await db.query(orderQuery, [order_id]);
   
    if (orderResult.rows.length === 0) {
      await db.query("ROLLBACK");
       
      return res.status(404).json({
       
        success: false,
        msg: "Order not found",
      });
    }

    if (orderResult.rows[0].shipped) {
      
      await db.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        msg: "Order has already been shipped",
      });
    }

     
    
    

    await db.query("COMMIT");

    // Send external request with order_id
    const response = await axios.post("http://localhost:6000/admin/paySupplier", { order_id });
    
    if (response.data.success) {
      // Update the shipped status
      const updateQuery = `
      UPDATE supplier_order
      SET shipped = true
      WHERE order_id = $1
    `;
      await db.query(updateQuery, [order_id]);
      console.log("GOOOOD");
      return res.status(200).json({
        success: true,
        msg: `Order ${order_id} has been marked as shipped`,
      });
    }
    
  } catch (error) {
    await db.query("ROLLBACK");

    res.status(500).json({
      success: false,
      msg: "Error processing request",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const query = "SELECT * FROM supplier_order";
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

exports.getAllShippedOrders = async (req, res) => {
  try {
    const query = "SELECT * FROM supplier_order WHERE shipped = true";
    const shippedOrders = await db.query(query);

    res.status(200).json({
      success: true,
      shippedOrders: shippedOrders.rows,
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
    const query = "SELECT * FROM supplier_order WHERE shipped = false";
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
