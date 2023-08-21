const db = require("../db");

exports.getNameByEmail = async (req, res) => {
    try {
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    const { email } = req.query;
    console.log(email);
      
    if (email != req.user.email) {
      return res.status(401).json({
        message: "Unauthorized Attempt.",
      });
    }

    const result = await db.query(
      "SELECT name FROM user_info WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = result.rows[0].name;
    res.status(200).json({ name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAddressByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (email != req.user.email) {
      return res.status(401).json({
        message: "Unauthorized Attempt.",
      });
    }

    const result = await db.query(
      "SELECT address FROM user_info WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = result.rows[0].address;
    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBankAccByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (email != req.user.email) {
      return res.status(401).json({
        message: "Unauthorized Attempt.",
      });
    }

    const result = await db.query(
      "SELECT bank_acc FROM payment_info WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const bankAcc = result.rows[0].bank_acc;
    res.status(200).json({ bankAcc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    const query = 'SELECT * FROM "order" WHERE email =$1';
    const orders = await db.query(query, [email]);

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
