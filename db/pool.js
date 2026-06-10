const { Pool } = require("pg");
require('dotenv').config();

module.exports = new Pool({
  host: "localhost",
  user: process.env.DB_USER,
  database: "project_todolist",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});