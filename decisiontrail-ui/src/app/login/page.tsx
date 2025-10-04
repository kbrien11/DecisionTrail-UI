'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setAlert({ show: true, message: 'Login successful! Redirecting...', type: 'success' });
                setTimeout(() => router.push('/dashboard'), 1500);
            } else {
                setAlert({ show: true, message: 'Login failed. Please try again.', type: 'error' });
                setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            }
        } catch {
            setAlert({ show: true, message: 'An error occurred. Please try again.', type: 'error' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row">
            {/* Left Panel */}
            <div className="sm:w-1/2 w-full bg-gradient-to-br from-black via-gray-400 to-white text-white flex flex-col justify-center items-center px-6 py-12">
                {/* Welcome Message */}
                <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">
                    Welcome to Audit Trail
                </h1>

                {/* Company Logo */}
                <div className="relative w-48 h-20 sm:w-64 sm:h-24 mb-6 bg-white/10 rounded-xl backdrop-blur-sm p-2">
                    <Image
                        src="/company_logo.png"
                        alt="DecisionAudit Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Tagline */}
                <p className="text-lg text-center text-white/90 max-w-sm leading-relaxed mb-4">
                    Log in to view your company’s biggest decisions.
                </p>

                {/* Optional Strategic Tagline */}
                <p className="text-sm text-center text-white/70 italic max-w-xs">
                    Strategic clarity starts here.
                </p>
            </div>

            {/* Right Panel */}
            <div className="sm:w-1/2 w-full flex items-center justify-center bg-white px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Alert */}
                    {alert.show && (
                        <div className={`px-4 py-3 rounded-md shadow-md text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <p className="text-sm font-medium">{alert.message}</p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-center text-2xl font-semibold text-gray-900">User Login</h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                                Email or Username
                            </label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500  focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 text-white bg-zinc-700 rounded-md ring-1 ring-transparent hover:ring-zinc-800 transition disabled:opacity-50"
                       >
                            {loading ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <p className="text-sm text-center text-gray-600">
                            Don’t have an account?{' '}
                            <Link href="/register" className="text-zinc-600 hover:text-zinc-800 hover:underline font-bold transition">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}