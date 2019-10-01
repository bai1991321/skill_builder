var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(() => {
  require('../models/user_model').initialize();
});

let getDB = () => {
  return connection;
}

module.exports = {
  getDB: getDB
}
