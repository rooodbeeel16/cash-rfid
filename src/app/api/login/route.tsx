import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: { json: () => Promise<any> }) {
  const { username, password } = await req.json();

  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cashteen__db',
    });

    // 🔍 Query user by username only
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]) as [any[], any];
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const user = rows[0];

    // 🔐 Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // ✅ Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'JWT secret is missing' }, { status: 500 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // ✅ Set cookie
    const res = NextResponse.json({ message: 'Login success' });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 });

    return res;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
