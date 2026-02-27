'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/app/components/Sidebar';
import { FaSpinner } from 'react-icons/fa6';

interface Submission {
    id: string | number;
    jobTitle: string;
    status: 'pending' | 'approved' | 'rejected' | 'revision_needed';
    submittedAt: string;
    fileUrl?: string;
    feedback?: string;
    jobId: string | number;
}

const MySubmissions = () => {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        const fetchSubmissions = async () => {
            if (!token) {
                router.push('/Login');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await fetch('http://localhost:8080/api/submissions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('authToken');
                        router.push('/Login?sessionExpired=true');
                        return;
                    }
                    throw new Error(`Failed to fetch submissions: ${res.status}`);
                }

                const data = await res.json();
                const submissionsArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.submissions)
                        ? data.submissions
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];
                setSubmissions(submissionsArray);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message || 'Could not load your submissions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'revision_needed':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg"><FaSpinner className="animate-spin" /></p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-600 text-lg text-center px-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Sidebar />

            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Submissions</h1>

                        {submissions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                                <p className="text-gray-600 text-lg">You haven't submitted any work yet.</p>
                                <p className="text-gray-500 mt-2">Start by placing bids on jobs and completing the accepted ones!</p>
                                <button
                                    onClick={() => router.push('/Jobs')}
                                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition"
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div className="flex-grow">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {submission.jobTitle}
                                                </h3>

                                                <p className="text-sm text-gray-500 mb-3">
                                                    Submitted on: {new Date(submission.submittedAt).toLocaleDateString('en-KES', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>

                                                {submission.feedback && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                                        <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                                                        <p className="text-sm text-blue-800">{submission.feedback}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-start md:items-end gap-3">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                                                        submission.status
                                                    )}`}
                                                >
                                                    {submission.status.replace('_', ' ')}
                                                </span>

                                                {submission.fileUrl && (
                                                    <a
                                                        href={submission.fileUrl}
                                                        download
                                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                                    >
                                                        Download File
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() => router.push(`/Jobs/${submission.jobId}`)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                                >
                                                    View Job →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MySubmissions;
