'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { FaSpinner } from 'react-icons/fa';

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

  const router = useRouter();

   useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
      const fetchDashboard = async () => {
        if (!token) {
          router.push('/Login');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg"><FaSpinner className="animate-spin" /></p>
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
      <h1 className="text-3xl md:text-4xl font-bold mt-3 lg:ml-64 text-gray-900 mb-5 px-4">
        Dashboard
      </h1>

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-1xl font-medium text-gray-700 mb-2">Wallet Balance</h3>
                <p className="text-2xl font-bold text-green-700">
                  ksh {data.wallet_balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-1xl font-medium text-gray-700 mb-2">Available Bids</h3>
                <p className="text-2xl font-bold text-blue-700">{data.available_bids}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-1xl font-medium text-gray-700 mb-2">Pending Submissions</h3>
                <p className="text-2xl font-bold text-orange-600">{data.pending_submissions}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-1xl font-medium text-gray-700 mb-2">Status</h3>
                <p
                  className={`text-xl font-bold capitalize ${data.status.toLowerCase() === 'active' ? 'text-green-600' : 'text-red-600'
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