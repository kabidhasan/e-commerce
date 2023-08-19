const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bank",
  password: "root",
  port: 5432,
});

// Connect to the database
pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL:", error);
  });

module.exports = { query: (text, params) => pool.query(text, params) };
