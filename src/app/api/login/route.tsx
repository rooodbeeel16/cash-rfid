// app/api/login/route.tsx

import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing username or password' }, { status: 400 });
    }

    // ✅ Connect to MySQL
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // or your MySQL root password
      database: 'cashteen__db',
    });

    // ✅ Query user by username
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]) as [any[], any];
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const user = rows[0];

    // ✅ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // ✅ Create JWT payload and sign it
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'JWT secret is missing' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // ✅ Set cookie (using next/headers)
    (await
      // ✅ Set cookie (using next/headers)
      cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
