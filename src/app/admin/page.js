import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/');
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    redirect('/');
  }

  return (
    <main className="min-h-screen flex bg-emerald-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-emerald-600">
          <h1 className="text-2xl font-bold tracking-wide">💰 CashTeen</h1>
          <p className="text-sm text-emerald-200">POS Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">
            💸 New Sale
          </a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">
            📦 Inventory
          </a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">
            📊 Reports
          </a>
          <a href="#" className="block px-4 py-3 rounded-lg hover:bg-emerald-600 transition">
            ⚙️ Settings
          </a>
        </nav>

        <form action="/api/logout" method="post" className="px-4 pb-6">
          <button
            type="submit"
            className="w-full bg-emerald-900 hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow flex justify-between items-center px-8 py-4">
          <h2 className="text-xl font-semibold text-emerald-700">Welcome, {user.username} 🧾</h2>
          <span className="text-gray-500 text-sm">Cashier Panel</span>
        </header>

        {/* Dashboard Cards */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-emerald-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-700">💸 New Sale</h3>
            <p className="text-sm text-gray-600 mt-2">Start a new transaction</p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-700">📦 Inventory</h3>
            <p className="text-sm text-gray-600 mt-2">Manage products & stocks</p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-emerald-700">📊 Reports</h3>
            <p className="text-sm text-gray-600 mt-2">View daily sales summary</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto text-center py-4 text-gray-500 text-sm">
          © 2025 CashTeen POS • Admin Dashboard
        </footer>
      </section>
    </main>
  );
}
