'use client';

import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Also clear server error when user starts typing again
    setServerError(null);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Login attempt with:', formData);

      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Response status:', res.status);
      console.log('Response status text:', res.statusText);

      if (!res.ok) {
        // Try to get the error message from backend
        const errorData = await res.text().catch(() => 'No response body');
        console.error('Server error response:', errorData);
        setServerError(errorData || `Login failed (${res.status} ${res.statusText})`);
        return;
      }

      // If success
      const data = await res.json();
      console.log('Login successful:', data);

      // Example: save token if your backend returns one
      if (data.token) {
       localStorage.setItem('authToken', data.token);
      //   // redirect or update app state
      }

      // For now just show success
      setServerError('Login successful!');

    } catch (err) {
      console.error('Fetch/login error:', err);
      setServerError('Network error - could not connect to server');
    } finally {
      setIsSubmitting(false);
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
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {errors.password && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Server error or success message */}
          {serverError && (
            <div className={`mt-4 p-3 rounded text-center text-sm ${
              serverError.includes('successful') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              mt-6 w-full 
              ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-800'} 
              text-white font-medium py-3.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg
            `}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
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