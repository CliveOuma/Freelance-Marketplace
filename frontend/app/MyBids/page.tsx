'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { FaSpinner } from 'react-icons/fa6';

interface Bid {
    id: string;
    job_id: string;
    job_title: string;
    job_status: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
    created_at: string;
}

const statusStyles: Record<string, string> = {
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    WITHDRAWN: 'bg-gray-100 text-gray-600',
};

const MyBids = () => {
    const router = useRouter();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        const fetchBids = async () => {
            if (!token) { router.push('/Login'); return; }

            try {
                const res = await fetch('http://localhost:8080/api/bids/my-bids', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.status === 401) {
                    localStorage.removeItem('authToken');
                    router.push('/Login?sessionExpired=true');
                    return;
                }
                if (!res.ok) throw new Error(`Failed to fetch bids: ${res.status}`);

                const data = await res.json();
                setBids(Array.isArray(data) ? data : data?.bids || data?.data || []);
            } catch (err: any) {
                setError(err.message || 'Could not load your bids.');
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-red-600 text-center px-4">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Sidebar />

            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bids</h1>

                    {bids.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                            <p className="text-gray-500">You haven't placed any bids yet.</p>
                            <button
                                onClick={() => router.push('/Jobs')}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                            >
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bids.map((bid) => (
                                <div
                                    key={bid.id}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex items-center justify-between gap-4"
                                >
                                    <p className="font-medium text-gray-900 truncate">{bid.job_title}</p>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusStyles[bid.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {bid.status.charAt(0) + bid.status.slice(1).toLowerCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBids;