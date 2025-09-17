import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',        // your XAMPP MySQL root password (default is empty)
  database: 'cashteen__db' // make sure this database exists
});
