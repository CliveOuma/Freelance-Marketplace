'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
  //  confirmedPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
  
  });

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
      newErrors.firstName = 'First Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'User Name is required';
      isValid = false;
    } else if (formData.userName.trim().length < 3) {
      newErrors.userName = 'User Name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    } else if (!/^\+?\d{9,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

   /* if (!formData.confirmedPassword) {
      newErrors.confirmedPassword = 'Please confirm password';
      isValid = false;
    } else if (formData.confirmedPassword !== formData.userPassword) {
      newErrors.confirmedPassword = 'Passwords do not match';
      isValid = false;
    }*/

    setErrors(newErrors);
    return isValid;
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix the form errors");
    return;
  }

  try {
    console.log("Submitting data:", formData);

    const response = await fetch(
      "http://localhost:8080/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.userName, // make sure backend expects "username"
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        }),
      }
    );

    const data = await response.json();

    console.log("Server response:", data);

    if (!response.ok) {
      console.error("Registration failed:", data);
      toast.error(data.message || "Registration failed");
      return;
    }

    toast.success("Account created successfully 🎉");
    console.log("User registered successfully");

    // Optional: reset form
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });

  } catch (error) {
    console.error("Network/server error:", error);
    toast.error("Server error. Please try again.");
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
            shadow-xl           /* stronger, modern shadow */
            shadow-gray-300/70   /* softer shadow color */
            px-8 py-10 
            border border-gray-100
            transition-all duration-300
          `}
        >
          <h3 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Create An Account
          </h3>

          <div className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition  text-black"
              />
              {errors.firstName && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-black"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.lastName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition  text-black"
              />
              {errors.userName && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.userName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition  text-black"
              />
              {errors.email && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition  text-black"
              />
              {errors.phoneNumber && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition  text-black"
              />
              {errors.password && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
             {/* <input
                type="password"
                placeholder="Confirm Password"
                name="confirmedPassword"
                value={formData.confirmedPassword}
                onChange={handleChange}
                className="w-full px-4   text-black py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {/*{errors.confirmedPassword && (
                <p className="mt-1.5 text-red-600 text-sm">{errors.confirmedPassword}</p>
              )}*/}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-blue-800 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/Login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;