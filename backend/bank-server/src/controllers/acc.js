const db = require("../db");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

// exports.getBalanceByAccNo = async (req, res) => {
//   try {
//     const { acc_no } = req.query;
//     const query = "SELECT balance FROM bank_user WHERE acc_no = $1";
//     const result = await db.query(query, [acc_no]);

//     if (!result.rows.length) {
//       return res.status(404).json({
//         success: false,
//         msg: "Account not found",
//       });
//     }

//     const balance = result.rows[0].balance;
//     res.status(200).json({
//       success: true,
//       balance: balance,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };
exports.getBalanceByAccNo = async (req, res) => {
  try {
    console.log("Balance koto?");
    const acc_no = req.query.acc_no;
    // const acc_no = req.user.acc_no; // Assuming you have access to logged-in user's account number
    console.log(acc_no);
    const query = "SELECT balance FROM bank_user WHERE acc_no = $1";
    const result = await db.query(query, [acc_no]);
    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    const balance = result.rows[0].balance;
    res.status(200).json({
      success: true,
      balance: balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

