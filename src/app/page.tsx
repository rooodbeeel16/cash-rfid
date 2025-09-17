'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-300 via-white to-emerald-200 relative overflow-hidden">

      {/* Subtle background shapes */}
      <div className="absolute top-[-6rem] left-[-6rem] w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-emerald-100 shadow-2xl rounded-3xl p-10 relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl">
            <span className="text-white text-4xl font-extrabold">₱</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-emerald-700 mb-2 tracking-wide">
          CashTeen POS
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">Cashier Login Portal</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">
              Cashier ID
            </label>
            <input
              type="text"
              placeholder="Enter your ID"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">
              PIN
            </label>
            <input
              type="password"
              placeholder="Enter your PIN"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-700"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Open Register
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          © 2025 CashTeen POS • All Rights Reserved
        </p>
      </div>
    </main>
  );
}
