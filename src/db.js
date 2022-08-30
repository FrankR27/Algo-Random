require("dotenv").config();
const mysql = require("mysql2/promise");

async function connectDB() {
  const connection = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const result = await connection.query("SELECT 1 + 1 AS Result");

  console.log(result);
}

module.exports = connectDB;
