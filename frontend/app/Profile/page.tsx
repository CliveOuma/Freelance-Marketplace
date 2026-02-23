'use client';

import React, { useState, useEffect } from 'react';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  email: string;
  phoneNumber: string;
  updatedAt: string;
  joinedAt: string;
  totalEarnings: number;
  submissions: number;
  rating: number;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    username: '',
    status: 'Dormant',
    email: '',
    phoneNumber: '',
    updatedAt: '',
    joinedAt: '',
    totalEarnings: 0,
    submissions: 0,
    rating: 2,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Simulated fetch — replace with real API
    const mockData: UserData = {
      firstName: 'Edgar',
      lastName: 'Omondi',
      username: 'edgar_writer_ke',
      status: 'Dormant',
      email: 'edgar.omondi@example.com',
      phoneNumber: '+254712345678',
      updatedAt: '23/02/26 22:03:00',
      joinedAt: '15/01/26 14:30:00',
      totalEarnings: 0,
      submissions: 0,
      rating: 2,
    };
    setUserData(mockData);
    setFormData({
      firstName: mockData.firstName,
      lastName: mockData.lastName,
      username: mockData.username,
      phoneNumber: mockData.phoneNumber,
    });
    setIsLoading(false);
  }, []);

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

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    else if (formData.firstName.trim().length < 2) newErrors.firstName = 'At least 2 characters';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    else if (formData.lastName.trim().length < 2) newErrors.lastName = 'At least 2 characters';

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'At least 3 characters';

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    else if (!/^\+?\d{9,15}$/.test(formData.phoneNumber.trim())) newErrors.phoneNumber = 'Invalid phone number';

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate update
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

      setUserData(prev => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        updatedAt: dateStr,
      }));
    }
  };

  const renderStars = (rating: number) => {
    return <span className="text-yellow-500">{ '★'.repeat(rating) + '☆'.repeat(5 - rating) }</span>;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-16 bg-gray-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
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
                { label: 'Status', name: 'status', value: userData.status, editable: false },
                { label: 'Email Address', name: 'email', value: userData.email, editable: false },
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

            <button
              type="submit"
              className="mt-8 w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3.5 rounded-lg transition shadow-md hover:shadow-lg uppercase tracking-wide"
            >
              Update
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="md:mt-14">
          <div className="bg-green-50 rounded-xl shadow-xl shadow-gray-300/70 px-8 py-10 border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Account Summary</h3>
            <div className="space-y-4 text-gray-900">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Updated:</span>
                <span>{userData.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total Earnings:</span>
                <span>${userData.totalEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Submissions:</span>
                <span>{userData.submissions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Rating:</span>
                <span>{renderStars(userData.rating)} ({userData.rating}/5)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Joined:</span>
                <span>{userData.joinedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;