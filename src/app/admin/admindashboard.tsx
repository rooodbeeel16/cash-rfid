'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard({ user }: { user: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [rfidUser, setRfidUser] = useState<any>(null);
  const [rfidInput, setRfidInput] = useState('');

  // Listen to global key presses to capture RFID scans
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // When Enter is pressed, treat the input as complete RFID
        if (!rfidInput) return;
        fetch(`/api/get-user?rfid=${rfidInput}`)
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setRfidUser(data.user);
              setModalOpen(true);
            } else {
              console.warn('RFID not registered');
            }
          })
          .finally(() => setRfidInput('')); // reset after processing
      } else {
        // Append typed character to rfidInput
        setRfidInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [rfidInput]);

  return (
    <main className="min-h-screen flex bg-emerald-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col shadow-lg">
        <div className="px-6 py-6 border-b border-emerald-600">
          <h1 className="text-2xl font-bold tracking-wide">💰 CashTeen</h1>
          <p className="text-sm text-emerald-200 mt-1">POS Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">💸 New Sale</a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">📦 Inventory</a>
          <a href="/add-account" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">👤 Add Account</a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">🛒 Canteen Products</a>
        </nav>
        <form action="/api/logout" method="post" className="px-4 pb-6">
          <button
            type="submit"
            className="w-full bg-emerald-900 hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col p-8">
        {/* Top Bar */}
        <header className="bg-white shadow flex justify-between items-center px-8 py-4 mb-6">
          <h2 className="text-xl font-semibold text-emerald-700">Welcome, {user.username} 🧾</h2>
          <span className="text-gray-500 text-sm">Cashier Panel</span>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-emerald-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-700">💸 New Sale</h3>
            <p className="text-sm text-gray-600 mt-2">Start a new transaction</p>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-700">📦 Inventory</h3>
            <p className="text-sm text-gray-600 mt-2">Manage products & stocks</p>
          </div>
        </div>

        {/* Modal */}
{modalOpen && rfidUser && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4">User Details</h2>
      <p><strong>Username:</strong> {rfidUser.username}</p>
      <p><strong>Role:</strong> {rfidUser.role}</p>
      <p><strong>RFID:</strong> {rfidUser.rfid}</p>
      <p><strong>ID Picture</strong>{rfidUser.picture}</p>
      <button
        onClick={() => setModalOpen(false)}
        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Close
      </button>
    </div>
  </div>
)}

      </section>
    </main>
  );
}
