var mysql = require("mysql");
const path = require("path");
const util = require("util");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

dbInfo = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  connectionLimit: 5, // mysql connection pool length
};

var dbconnection = mysql.createPool(dbInfo);

dbconnection.getConnection((err, connection) => {
  if (err) console.error(err);

  if (connection) connection.release();
  return;
});

dbconnection.query = util.promisify(dbconnection.query);

module.exports = dbconnection;
