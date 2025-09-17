import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    const buf = Buffer.from(await req.arrayBuffer());

    const parsed = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(bufferToStream(buf) as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const username = parsed.fields.username as unknown as string;
    const password = parsed.fields.password as unknown as string;
    const rfid = parsed.fields.rfid as unknown as string;
    const role = parsed.fields.role as unknown as string;
    const profile_picture = parsed.files.profile_picture
      ? `/uploads/${path.basename((parsed.files.profile_picture as any).filepath)}`
      : null;

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
