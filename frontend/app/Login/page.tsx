'use client';

import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    userPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    userPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error as soon as user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Password
    if (!formData.userPassword) {
      newErrors.userPassword = 'Password is required';
      isValid = false;
    } else if (formData.userPassword.length < 6) {
      newErrors.userPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Replace with your actual login API call
      try {
        console.log('Login attempt with:', formData);
        // Example:
        // const res = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // if (res.ok) { redirect or set session }
      } catch (err) {
        console.error('Login error:', err);
        // You can set a general form error here if needed
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-16 bg-gray-50">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className={`
            bg-white 
            rounded-xl 
            shadow-xl 
            shadow-gray-300/70 
            px-8 py-10 
            border border-gray-100
            transition-all duration-300
          `}
        >
          <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Login to Your Account
          </h3>

          <div className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="userPassword"
                placeholder="Password"
                value={formData.userPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {errors.userPassword && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.userPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </button>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/SignUp" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </p>

            <p>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Forgot your password? Reset it
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;