'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/'); // redirect to login/home page
      } else {
        console.error('Failed to logout');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-emerald-900 hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold transition"
    >
      Logout
    </button>
  );
}
