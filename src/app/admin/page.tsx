import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AdminDashboard from './admindashboard';

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) redirect('/');

  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error('JWT_SECRET is not set');

  let user;
  try {
    user = jwt.verify(token, secret) as { username: string; [key: string]: any };
  } catch (err) {
    redirect('/');
  }

  return <AdminDashboard user={user} />;
}
