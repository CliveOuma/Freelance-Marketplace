'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Job {
  id: string | number;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: number;
  status: string;
}

const JOBS_API_URL = 'http://localhost:8080/api/jobs';

const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [biddingJobId, setBiddingJobId] = useState<string | number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const fetchJobs = async () => {
      if (!token) {
        router.push('/Login');
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
            window.location.href = '/Login?sessionExpired=true';
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


  const handlePlaceBid = async (job: Job) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/Login');
      return;
    }

    try {
      setBiddingJobId(job.id);
      const res = await fetch(`http://localhost:8080/api/jobs/${job.id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: job.id }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Check if the backend sends a specific message for already-bid jobs
        if (data.message && data.message.toLowerCase().includes('already placed')) {
          toast.error('You have already placed a bid on this job.');
          return;
        }
        throw new Error(data.message || `Failed to place bid: ${res.status}`);
      }

      toast.success('Bid placed successfully!');
    } catch (err: any) {
      console.error('Bid error:', err);
      toast.error(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setBiddingJobId(null);
    }
  };
  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
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
      <h1 className="text-3xl md:text-4xl font-bold mt-2 lg:ml-64 text-gray-900 mb-3 px-4">
        Available Jobs
      </h1>
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 p-4 md:p-6 lg:p-5">
          <div className="max-w-7xl mx-auto">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No jobs available at the moment. Check back soon!</p>
              </div>
            ) : (
              <>
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
                          <p><span className="font-medium">Description</span> {job.description}</p>
                          <p className="line-clamp-3">
                            <span className="font-medium">Category:</span> {job.category}
                          </p>
                          <p className="line-clamp-3">
                            <span className="font-medium">Budget:</span> ksh {job.budget}
                          </p>
                          <p className="line-clamp-3">
                            <span className="font-medium">Deadline:</span> {job.deadline}
                          </p>
                        </div>
                        <p className=" flex w-full bg-green-300 text-gray-800 rounded-lg text-sm py-2 px-2">
                          <span className="font-medium text-gray-900">Status:</span> {job.status}
                        </p>
                      </div>

                      <div className="px-6 pb-6 flex text-center gap-3 mt-auto">
                        <button
                          onClick={() => handlePlaceBid(job)}
                          disabled={biddingJobId === job.id}
                          className={`flex-1 font-medium py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center gap-2 ${biddingJobId === job.id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                          {biddingJobId === job.id ? (
                            <><FaSpinner className="animate-spin" /> Placing...</>
                          ) : (
                            'Place Bid'
                          )}
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
                          className={`px-4 py-2 rounded-lg border min-w-[40px] ${currentPage === page
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