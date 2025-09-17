'use client';

import { useState } from 'react';

export default function AddAccountPage() {
  const [form, setForm] = useState<{
    username: string;
    password: string;
    rfid: string;
    role: string;
    profile_picture: File | null;
  }>({
    username: '',
    password: '',
    rfid: '',
    role: 'student',
    profile_picture: null,
  });

  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('password', form.password);
      formData.append('rfid', form.rfid);
      formData.append('role', form.role);
      if (form.profile_picture) {
        formData.append('profile_picture', form.profile_picture);
      }

      const res = await fetch('/api/add-account', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Account created successfully');
        setForm({ username: '', password: '', rfid: '', role: 'student', profile_picture: null });
      } else {
        setMessage('❌ ' + (data.error || 'Failed to create account'));
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong');
    }
  };

  return (
    <main className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col shadow-lg">
        <div className="px-6 py-6 border-b border-emerald-600">
          <h1 className="text-2xl font-bold tracking-wide">💰 CashTeen</h1>
          <p className="text-sm text-emerald-200 mt-1">POS Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a
            href="/admin"
            className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition flex items-center gap-2"
          >
            🏠 Dashboard
          </a>
          <a
            href="/add-account"
            className="block px-4 py-3 rounded-lg bg-emerald-900 flex items-center gap-2 shadow-inner"
          >
            ➕ Add Account
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex items-center justify-center p-12 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-emerald-700 text-center mb-10">
            Add New Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Role */}
            <div className="flex flex-col">
              <label className="text-gray-800 font-semibold mb-2">Role</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition shadow-sm hover:shadow"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="parents">Parents</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Username */}
            <div className="flex flex-col">
              <label className="text-gray-800 font-semibold mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition shadow-sm hover:shadow"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-gray-800 font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition shadow-sm hover:shadow"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col">
              <label className="text-gray-800 font-semibold mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition shadow-sm hover:shadow"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setForm({ ...form, profile_picture: e.target.files[0] });
                  }
                }}
              />
            </div>

            {/* RFID */}
            <div className="flex flex-col">
              <label className="text-gray-800 font-semibold mb-2">RFID</label>
              <input
                type="text"
                placeholder="Enter RFID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 transition shadow-sm hover:shadow"
                value={form.rfid}
                onChange={(e) => setForm({ ...form, rfid: e.target.value })}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-2xl"
            >
              Create Account
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm mt-2 text-gray-600">{message}</p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
