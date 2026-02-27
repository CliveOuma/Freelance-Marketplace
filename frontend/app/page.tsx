'use client';

import Link from 'next/link';
import { useState, useEffect, ReactNode } from 'react';
import { FaBriefcase, FaMoneyBillWave, FaStar, FaUser } from 'react-icons/fa';
import { HiOutlineSearch } from 'react-icons/hi';
import { MdAnalytics, MdMessage, MdSecurity } from 'react-icons/md';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute bottom-40 left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
        />
      </div>


      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700">
              Join 10,000+ writers and employers
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-2xl lg:text-8xl font-bold mb-6 leading-tight animate-slide-up">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Where Words
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Meet Opportunity
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Connect talented writers with businesses that need exceptional content.
            Post jobs, submit bids, and create amazing work together.
          </p>



          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <StatCard number="10K+" label="Active Writers" />
            <StatCard number="5K+" label="Jobs Posted" />
            <StatCard number="$2M+" label="Paid Out" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 bg-white py-24">
        <div className="max-w-7xlmx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple. Fast. Effective.
            </h2>
            <p className="text-xl text-slate-600">
              Get started in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessCard
              number="01"
              title="Create Your Profile"
              description="Sign up as a writer or employer. Set up your profile with your skills and experience."
              icon={<FaUser className="text-blue-600 text-2xl" />}
            />
            <ProcessCard
              number="02"
              title="Browse & Bid"
              description="Writers browse available jobs and submit bids. Employers review proposals and select the best fit."
              icon={<FaBriefcase className="text-blue-600 text-2xl" />}
            />
            <ProcessCard
              number="03"
              title="Work & Get Paid"
              description="Collaborate seamlessly, deliver great work, and get paid securely through the platform."
              icon={<FaMoneyBillWave className="text-blue-600 text-2xl" />}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center md:text-2xl mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features for writers and employers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<HiOutlineSearch className="text-blue-600 text-3xl" />}
              title="Smart Job Matching"
              description="AI-powered recommendations match writers with jobs that fit their expertise."
            />
            <FeatureCard
              icon={<MdMessage className="text-blue-600 text-3xl" />}
              title="Real-time Messaging"
              description="Communicate directly with writers or employers throughout the project."
            />
            <FeatureCard
              icon={<MdAnalytics className="text-blue-600 text-2xl" />}
              title="Track Progress"
              description="Monitor job status, deadlines, and milestones in one organized dashboard."
            />
            <FeatureCard
              icon={<FaStar className="text-blue-600 text-2xl" />}
              title="Rating System"
              description="Build your reputation with reviews and ratings from completed projects."
            />
            <FeatureCard
              icon={<MdSecurity className="text-blue-600 text-2xl" />}
              title="Secure Payments"
              description="Escrow protection ensures safe transactions for both parties."
            />
            <FeatureCard
              icon={<MdAnalytics className="text-blue-600 text-3xl" />}
              title="Analytics Dashboard"
              description="Track earnings, job history, and performance metrics over time."
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of writers and employers creating amazing content together
          </p>
          <Link
            href="/SignUp"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-slate-300 py-16">


        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© 2025 WritersHub. All rights reserved.</p>
        </div>

      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm text-slate-600 font-medium">{label}</div>
    </div>
  );
}

// Process Card Component
function ProcessCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: ReactNode }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      <div className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
        <div className="text-5xl mb-4">{icon}</div>
        <div className="text-sm font-bold text-blue-600 mb-2">{number}</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}