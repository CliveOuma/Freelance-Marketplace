'use client';

import Link from 'next/link';
import { usePathname} from 'next/navigation';
import { FaHome, FaUser, FaBriefcase, FaClipboardList, FaFileAlt} from 'react-icons/fa';

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/Dashboard', icon: <FaHome className="text-blue-600 text-2xl" /> },
        { label: 'Profile', href: '/Profile', icon: <FaUser className="text-blue-600 text-2xl" /> },
        { label: 'Jobs', href: '/Jobs', icon: <FaBriefcase className="text-blue-600 text-2xl" /> },
        { label: 'My Bids', href: '/MyBids', icon: <FaClipboardList className="text-blue-600 text-2xl" /> },
        { label: 'My Submissions', href: '/MySubmissions', icon: <FaFileAlt className="text-blue-600 text-2xl" /> },
    ];

    return (
        <aside
            className="
        hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-gray-200 lg:bg-white lg:shadow
        lg:fixed lg:inset-y-0 lg:left-0 lg:z-30
      "
        >
            <div className="h-full flex my-8 flex-col">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 ml-4 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaBriefcase className="text-white text-2xl" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">WritersHub</span>
                </Link>
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
            </div>
        </aside>
    );
};

export default Sidebar;
