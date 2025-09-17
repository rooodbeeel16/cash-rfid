import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cashteen__db',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password, rfid, role, profile_picture } = req.body;

  if (!username || !password || !rfid || !role || !profile_picture) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      // Insert into students table
      await conn.execute(
        'INSERT INTO students (username, password, rfid, role, profile_picture) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, rfid, role]
      );
    } else {
      // Insert into accounts table for staff/parents/admin
      await conn.execute(
        'INSERT INTO accounts (username, password, rfid, role, profile_picture) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, rfid, role]
      );
    }

    await conn.end();
    res.status(200).json({ message: 'Account created successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Database error' });
  }
}
