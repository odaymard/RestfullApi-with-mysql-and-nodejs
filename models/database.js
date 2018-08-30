let mysql = require("mysql");
let execsql = require("exec-sql");
let path = require("path");
let config = require('../config/config')
execsql.connect({
  multipleStatements: true,
  user: "root",
  password: "root",
  database: "nodemysql"
});
execsql.executeFile("./tables.sql", function(err) {
  if (err) {
    console.log(err);
  }
  execsql.disconnect();
  console.log("db created");
});

let db = mysql.createConnection(process.env.DATABASE_CONFIG||config.DATABASE_CONFIG);

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

module.exports = { db };
