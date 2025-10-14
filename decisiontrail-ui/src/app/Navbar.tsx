'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = 'authToken=; Max-Age=0; path=/;';
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Brand */}
                <Link
                    href="/"
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"
                >
                    DecisionTrail
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/login"
                        className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                    >
                        Register
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-red-500 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
}