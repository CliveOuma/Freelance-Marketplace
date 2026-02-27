'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import {
    FaBars,
    FaTimes,
    FaBriefcase,
    FaSignOutAlt,
    FaHome,
    FaUser,
    FaClipboardList,
    FaFileAlt
} from 'react-icons/fa';

const Navbar = () => {
    const { isLoggedIn, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        router.push('/');
    };

    const closeMenu = () => setIsMenuOpen(false);

    const navItems = [
        { label: 'Dashboard', href: '/Dashboard', icon: <FaHome className="text-blue-600 text-xl" /> },
        { label: 'Profile', href: '/Profile', icon: <FaUser className="text-blue-600 text-xl" /> },
        { label: 'Jobs', href: '/Jobs', icon: <FaBriefcase className="text-blue-600 text-xl" /> },
        { label: 'My Bids', href: '/MyBids', icon: <FaClipboardList className="text-blue-600 text-xl" /> },
        { label: 'My Submissions', href: '/MySubmissions', icon: <FaFileAlt className="text-blue-600 text-xl" /> },
    ];

    return (
        <>
            {/* ───────────── NAVBAR ───────────── */}
            <nav className="bg-white p-4 flex justify-between items-center shadow-sm">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaBriefcase className="text-white text-2xl" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                        WritersHub
                    </span>
                </Link>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Desktop Navigation */}
                {!loading && (
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/Login"
                                    className="font-bold text-blue-500 hover:text-blue-600 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/SignUp"
                                    className="font-bold bg-blue-700 text-white hover:bg-blue-600 transition px-4 py-2 rounded-lg"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* ───────────── MOBILE SIDEBAR ───────────── */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:hidden
                `}
            >
                <div className="flex flex-col h-full">

                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-blue-700">
                            WritersHub
                        </h2>
                        <button
                            onClick={closeMenu}
                            className="text-2xl text-gray-600 hover:text-gray-900"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {!loading && (
                            isLoggedIn ? (
                                <>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                hover:bg-gray-100 transition-colors
                                                ${pathname === item.href
                                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                                    : 'text-gray-800'}
                                            `}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    ))}

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/Login"
                                        onClick={closeMenu}
                                        className="block px-4 py-3 text-blue-600 font-bold hover:bg-gray-100 rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/SignUp"
                                        onClick={closeMenu}
                                        className="block px-4 py-3 bg-blue-700 text-white font-bold hover:bg-blue-600 rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </>
                            )
                        )}
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}
        </>
    );
};

export default Navbar;