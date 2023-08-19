const db = require("../db");
const { hash } = require("bcryptjs");
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

//
// exports.register = async (req, res) => {
//   try {
//     const { email, password, address, name } = req.body;
//     hashedPassword = await hash(password, 10);
//     await db.query(
//       "INSERT INTO user_info (email, name, password, address) values ($1, $2, $3, $4)",
//       [email, name, hashedPassword, address]
//     );

//     //why we are inserting into cart?
//     await db.query("INSERT INTO cart(email) values ($1)", [email]);

//     return res.status(201).json({

//       success: "true",
//       msg: "User registartion successful",
//     });
//   } catch (error) {
//     res.status(401).json({
//       error: error.message,
//     });
//   }
// };

exports.register = async (req, res) => {
  try {
    const { email, password, address, name } = req.body;
    const hashedPassword = await hash(password, 10);

    // Insert user into user_info table and get the generated _id
    const userInsertResult = await db.query(
      "INSERT INTO user_info (email, name, password, address) VALUES ($1, $2, $3, $4) RETURNING user_id",
      [email, name, hashedPassword, address]
    );

    const user_id = userInsertResult.rows[0]._id;
    // console.log(user_id);
    // Insert cart record associated with the user
    await db.query("INSERT INTO cart (user_id) VALUES ($1)", [user_id]);

    // Create payload for JWT
    let payload = {
      _id: user_id,
      name: name,
      email: email,
      isAdmin: false,
    };

    // Generate JWT token
    const token = await sign(payload, SECRET);

    // Send response with user information and token
    res.status(201).cookie("token", token, { httpOnly: true }).json({
      _id: payload._id,
      name: name,
      email: email,
      isAdmin: payload.isAdmin,
      token: token,
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};

// exports.login = async (req, res) => {
//   try {
//     let user = req.user;
//     console.log(req.user);
//     let payload = {
//       email: user.email,
//     };
//     const token = await sign(payload, SECRET);
//     res.status(200).cookie("token", token, { httpOnly: true }).json({
//       success: true,
//       msg: "Logged in successfully",
//     });
//   } catch (error) {
//     res.status(401).json({
//       error: error.message,
//     });
//   }
// };
exports.login = async (req, res) => {
  try {
    let user = req.user;
    let payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = await sign(payload, SECRET);

    res.status(200).cookie("token", token, { httpOnly: true }).json({
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      isAdmin: payload.isAdmin,
      token: token,
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
