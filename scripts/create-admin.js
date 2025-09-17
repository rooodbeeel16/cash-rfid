// scripts/create-admin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'cashteen__db',
  });

  const username = 'admin';
  const plainPassword = 'admin123'; // change if you want
  const hash = await bcrypt.hash(plainPassword, 10);

  await conn.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash]
  );

  console.log('Admin user created:', username, '/', plainPassword);
  await conn.end();
  process.exit(0);
})();
