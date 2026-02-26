'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardData {
  wallet_balance: number;
  available_bids: number;
  pending_submissions: number;
  status: string;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/Dashboard', icon: '🏠' },
    { label: 'Profile', href: '/Profile', icon: '👤' },
    { label: 'Jobs', href: '/Jobs', icon: '💼' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:8080/api/users/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('authToken');
            router.replace('/login?sessionExpired=true');
            return;
          }
          const errText = await res.text().catch(() => 'Unknown error');
          throw new Error(`Failed to load dashboard: ${res.status} - ${errText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const closeMenu = () => setIsMenuOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <p className="text-red-600 text-xl mb-4">{error || 'No dashboard data available'}</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header with Hamburger */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-2xl text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Open menu"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

        <div className="w-8" />
      </header>

      {/* Slide-in Navigation Menu (mobile) */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">Arcade Writers</h2>
            <button
              onClick={closeMenu}
              className="text-2xl text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors
                  ${pathname === item.href ? 'bg-blue-50 text-blue-700 font-semibold' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
              <span className="text-xl">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-gray-200 lg:bg-white lg:shadow
          lg:fixed lg:inset-y-0 lg:left-0 lg:z-30
        "
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-700">Arcade Writers</h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors
                  ${pathname === item.href ? 'bg-blue-50 text-blue-700 font-semibold' : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
              <span className="text-xl">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="hidden lg:block bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Writer Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Wallet Balance</h3>
                <p className="text-3xl font-bold text-green-700">
                  KSH {data.wallet_balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Available Bids</h3>
                <p className="text-3xl font-bold text-blue-700">{data.available_bids}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Pending Submissions</h3>
                <p className="text-3xl font-bold text-orange-600">{data.pending_submissions}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Your Status</h3>
                <p
                  className={`text-2xl font-bold capitalize ${
                    data.status.toLowerCase() === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {data.status}
                </p>
              </div>
            </div>

            {/* Pending Submissions */}
            <div className="bg-white rounded-xl shadow p-8 mb-12 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Pending Submissions</h2>

              {data.pending_submissions === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 text-lg mb-6">No pending submissions at the moment.</p>
                  <Link
                    href="/Jobs"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <p className="text-gray-700">
                  You have {data.pending_submissions} submission(s) awaiting review.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;