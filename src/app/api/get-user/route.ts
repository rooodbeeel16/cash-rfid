// app/api/get-user/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rfid = searchParams.get('rfid');

  if (!rfid) {
    return NextResponse.json({ error: 'RFID is required' }, { status: 400 });
  }

  // Connect to your database
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cashteen__db',
  });

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM students WHERE rfid = ? LIMIT 1',
      [rfid]
    );

    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'RFID not found' }, { status: 404 });
    }

    return NextResponse.json({ user: (rows as any)[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    connection.end();
  }
}
