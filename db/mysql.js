const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DEEPGRAM_MYSQL_HOST || 'localhost',
  user: process.env.DEEPGRAM_MYSQL_USER || 'deepgram',
  password: process.env.DEEPGRAM_MYSQL_PASSWORD || 'deepgram',
  database: process.env.DEEPGRAM_MYSQL_DATABASE || 'deepgram'
});

module.exports = pool;
