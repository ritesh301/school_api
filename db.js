const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // Not 'localhost'
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL DB!');
});

module.exports = connection;
