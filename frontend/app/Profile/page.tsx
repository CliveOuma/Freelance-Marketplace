'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  updatedAt: string;
  joinedAt: string;
  totalEarnings: number;
  submissions: number;
  rating: number;
  // Add role/status if present in your real response
  status?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Dashboard', href: '/Dashboard', icon: '🏠' },
    { label: 'Profile', href: '/Profile', icon: '👤' },
    { label: 'Jobs', href: '/Jobs', icon: '💼' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        setIsLoading(true);

        const res = await fetch('http://localhost:8080/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('authToken');
            router.replace('/login');
            return;
          }
          throw new Error(`Failed to load profile: ${res.status}`);
        }

        const json: UserProfile = await res.json();
        setProfile(json);

        setFormData({
          firstName: json.firstName || '',
          lastName: json.lastName || '',
          username: json.username || '',
          phoneNumber: json.phoneNumber || '',
        });
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setSubmitMessage({ type: 'error', text: err.message || 'Failed to load profile' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'At least 2 characters';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'At least 2 characters';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'At least 3 characters';
      isValid = false;
    }

    // Phone number - accept both +254... and 07...
    const phoneValue = formData.phoneNumber.trim();
    if (!phoneValue) {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    } else {
      const digitsOnly = phoneValue.replace(/[^\d+]/g, '');
      const isValidKenyan =
        (/^\+254[17]\d{8}$/.test(digitsOnly)) ||
        (/^07[0-9]\d{7}$/.test(digitsOnly));

      if (!isValidKenyan) {
        newErrors.phoneNumber = 'Enter a valid Kenyan number (e.g. +254712345678 or 0712345678)';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    // Normalize phone number to +254 format
    let normalizedPhone = formData.phoneNumber.trim().replace(/[\s\-()]/g, '');

    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '+254' + normalizedPhone.slice(1);
    } else if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+254' + normalizedPhone;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      phoneNumber: normalizedPhone,
    };

    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch('http://localhost:8080/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message?.[0] || errData.message || 'Update failed');
      }

      const updated = await res.json();

      setProfile((prev) => ({ ...prev!, ...updated }));
      setSubmitMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Redirect to Dashboard after successful update
      setTimeout(() => {
        router.push('/Dashboard');
      }, 1500); // brief delay to show success message

    } catch (err: any) {
      console.error('Profile update error:', err);
      setSubmitMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">Unable to load profile data</p>
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

        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>

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
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Edit Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 uppercase">
                  Your Saved Information
                </h2>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl shadow-gray-300/70 px-8 py-10 border border-gray-100">
                  <div className="space-y-6">
                    {[
                      { label: 'First Name', name: 'firstName', value: formData.firstName, editable: true },
                      { label: 'Last Name', name: 'lastName', value: formData.lastName, editable: true },
                      { label: 'Username', name: 'username', value: formData.username, editable: true },
                      { label: 'Email Address', name: 'email', value: profile.email, editable: false },
                      { label: 'Phone Number', name: 'phoneNumber', value: formData.phoneNumber, editable: true },
                    ].map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
                          {field.label}
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.name.includes('email') ? 'email' : field.name.includes('phone') ? 'tel' : 'text'}
                          value={field.value}
                          onChange={field.editable ? handleChange : undefined}
                          disabled={!field.editable}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          className={`
                            w-full px-4 py-3 rounded-lg border 
                            ${field.editable 
                              ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-400' 
                              : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'}
                            outline-none transition
                          `}
                        />
                        {field.editable && errors[field.name as keyof typeof errors] && (
                          <p className="mt-1.5 text-red-600 text-sm">{errors[field.name as keyof typeof errors]}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {submitMessage && (
                    <div
                      className={`mt-6 p-4 rounded-lg text-center ${
                        submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {submitMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      mt-8 w-full 
                      ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-800 hover:bg-blue-900'} 
                      text-white font-medium py-3.5 rounded-lg transition shadow-md hover:shadow-lg uppercase tracking-wide
                    `}
                  >
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </form>
              </div>

              {/* Right: Summary Card */}
              <div className="md:mt-14">
                <div className="bg-green-50 rounded-xl shadow-xl shadow-gray-300/70 px-8 py-10 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Your Account Summary</h3>
                  <div className="space-y-4 text-gray-900">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Updated:</span>
                      <span>{profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Joined:</span>
                      <span>{profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Total Earnings:</span>
                      <span>KSH {profile.totalEarnings?.toLocaleString('en-KE') || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Submissions:</span>
                      <span>{profile.submissions ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <span>{renderStars(profile.rating ?? 0)} ({profile.rating ?? 0}/5)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const renderStars = (rating: number) => {
  return <span className="text-yellow-500">{'★'.repeat(rating) + '☆'.repeat(5 - rating)}</span>;
};

export default Profile;