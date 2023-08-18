const express = require("express");
const db = require("../db"); 
const router = express.Router();

exports.transaction = async (req, res) => {
  try {
    var { sender_acc, receiver_acc, amount } = req.body;
      amount = parseFloat(amount);
    
    await db.query("BEGIN");

    // Get the sender's and receiver's current balances
    const senderBalanceQuery =
      "SELECT balance FROM bank_user WHERE acc_no = $1";
    const receiverBalanceQuery =
      "SELECT balance FROM bank_user WHERE acc_no = $1";
    const senderBalanceResult = await db.query(senderBalanceQuery, [
      sender_acc,
    ]);
    const receiverBalanceResult = await db.query(receiverBalanceQuery, [
      receiver_acc,
    ]);

    var senderBalance = parseFloat(senderBalanceResult.rows[0].balance);
    var receiverBalance = parseFloat(receiverBalanceResult.rows[0].balance);

      console.log("senderBalance:", senderBalance, typeof senderBalance);
      console.log("amount:", amount, typeof amount);

      console.log(senderBalance < amount);

    
    if (senderBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update sender's balance
    const newSenderBalance = senderBalance - amount;
    await db.query("UPDATE bank_user SET balance = $1 WHERE acc_no = $2", [
      newSenderBalance,
      sender_acc,
    ]);

    // Update receiver's balance
    const newReceiverBalance = receiverBalance + amount;
    await db.query("UPDATE bank_user SET balance = $1 WHERE acc_no = $2", [
      newReceiverBalance,
      receiver_acc,
    ]);

    // Insert the transaction details
    const insertQuery = `
      INSERT INTO "transaction" (sender_acc, receiver_acc, amount)
      VALUES ($1, $2, $3)
      RETURNING transaction_id, date, time;
    `;
    const insertResult = await db.query(insertQuery, [
      sender_acc,
      receiver_acc,
      amount,
    ]);

    // Commit the transaction
    await db.query("COMMIT");

    res.status(201).json({
      success: true,
      msg: "Transaction created successfully",
      transaction: insertResult.rows[0],
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.query("ROLLBACK");

    res.status(500).json({
      success: false,
      msg: "Error creating transaction",
      error: error.message,
    });
  }
};
