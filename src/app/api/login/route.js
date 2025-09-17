// src/app/api/login/route.js
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    // 🛢️ Connect to MySQL (XAMPP)
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',           // your MySQL password if you set one
      database: 'cashteen__db', // ✅ updated database name
    });

    // 🔍 Find matching user
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    await db.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { username: rows[0].username, id: rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Set the token as a cookie
    const res = NextResponse.json({ message: 'Login success' });
    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return res;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
