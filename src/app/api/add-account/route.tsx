// /app/api/add-account/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // <-- Web API FormData
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const rfid = formData.get('rfid')?.toString();
    const role = formData.get('role')?.toString();

    if (!username || !password || !rfid || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let profile_picture: string | null = null;

    const file = formData.get('profile_picture') as File | null;
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const filePath = path.join(uploadsDir, file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      profile_picture = `/uploads/${file.name}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cashteen__db',
    });

    if (role === 'student') {
      await conn.execute(
        'INSERT INTO students (username, password, rfid, role, profile_picture) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, rfid, role, profile_picture]
      );
    } else {
      await conn.execute(
        'INSERT INTO accounts (username, password, rfid, role, profile_picture) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, rfid, role, profile_picture]
      );
    }

    await conn.end();
    return NextResponse.json({ message: 'Account created successfully' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
