'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Job {
  id: string | number;
  title: string;
  dueDate: string;
  context: string;
  pages: number;
  amount: number;
}

const JOBS_API_URL = 'http://localhost:8080/api/jobs';

const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/Dashboard', icon: '🏠' },
    { label: 'Profile', href: '/Profile', icon: '👤' },
    { label: 'Jobs', href: '/Jobs', icon: '💼' },
  ];

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const fetchJobs = async () => {
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(JOBS_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login?sessionExpired=true';
            return;
          }
          throw new Error(`Failed to fetch jobs: ${res.status}`);
        }

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs || data.data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Could not load available jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch single job details when "View Details" is clicked
  const handleViewDetails = async (jobId: string | number) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Please log in to view job details.');
      return;
    }

    try {
      const url = `http://localhost:8080/api/jobs/${jobId}?jobId=${jobId}`;
      console.log(`Fetching job details from: ${url}`);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Failed to fetch job details: ${res.status} - ${errText}`);
      }

      const jobDetails = await res.json();
      console.log('Job details fetched:', jobDetails);

      // You can now do something with the data, e.g.:
      // - Open a modal
      // - Navigate to a details page: router.push(`/jobs/${jobId}`)
      // - Store in state
      alert(`Job details loaded for "${jobDetails.title || 'Job'}"\nCheck console for full response.`);

    } catch (err: any) {
      console.error('View details error:', err);
      alert(`Error loading job details: ${err.message}`);
    }
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const closeMenu = () => setIsMenuOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading available jobs...</p>
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
      {/* Mobile Header with Hamburger */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-2xl text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Open menu"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold text-gray-800">Available Jobs</h1>

        <div className="w-8" />
      </header>

      {/* Slide-in Navigation Menu (mobile only) */}
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

      {/* Overlay when menu is open on mobile */}
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
          <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="lg:hidden text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Available Jobs
            </h1>

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No jobs available at the moment. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Job Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {job.title}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                          <p>
                            <span className="font-medium">Due Date:</span> {job.dueDate}
                          </p>
                          <p className="line-clamp-3">
                            <span className="font-medium">Context:</span> {job.context}
                          </p>
                          <p>
                            <span className="font-medium">Pages:</span> {job.pages} pages
                          </p>
                          <p className="text-lg font-bold text-green-700 mt-3">
                            Total Amount: KSH{' '}
                            {job.amount.toLocaleString('en-KE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 flex gap-3 mt-auto">
                        <button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                          onClick={() => {
                            alert(`Bidding on job: ${job.title}`);
                            // Replace with real bid logic (POST request) later
                          }}
                        >
                          Place Bid
                        </button>

                        <button
                          onClick={() => handleViewDetails(job.id)}
                          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center items-center gap-3 flex-wrap">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-5 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const page = currentPage - 3 + i;
                      if (page < 1 || page > totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 rounded-lg border min-w-[40px] ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AvailableJobs;