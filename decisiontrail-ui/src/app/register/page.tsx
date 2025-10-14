'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        company: '',
        projects: [''],
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const { name, value } = e.target;
        if (name === 'projects' && typeof index === 'number') {
            const updated = [...formData.projects];
            updated[index] = value;
            setFormData({ ...formData, projects: updated });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addProjectField = () => {
        setFormData({ ...formData, projects: [...formData.projects, ''] });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, type: '', message: '' });

        try {
            const res = await fetch('https://decisiontrail.onrender.com/accounts/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Registration failed');

            setAlert({ show: true, type: 'success', message: 'Registration successful!' });
            setFormData({ email: '', password: '', username: '', company: '', projects: [''] , first_name:'' ,last_name: ''  });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setAlert({ show: true, type: 'error', message: err.message });
            } else {
                setAlert({ show: true, type: 'error', message: 'An unexpected error occurred.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row">
            {/* Left Panel */}
            <div className="sm:w-1/2 w-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-white flex flex-col justify-center items-center px-6 py-12 rounded-r-xl shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">Welcome to Audit Trail</h1>
                <div className="relative aspect-[3/1] w-72 sm:w-80 mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-xl p-1 shadow-md">
                    <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <Image
                            src="/company_logo.png"
                            alt="DecisionAudit Logo"
                            fill
                            className="object-contain p-2 sm:p-4"
                        />
                    </div>
                </div>
                <p className="text-lg text-center text-white/90 max-w-sm leading-relaxed mb-4">
                    Sign up to track your company’s biggest decisions.
                </p>
                <p className="text-sm text-center text-white/70 italic max-w-xs">
                    Strategic clarity starts here.
                </p>
            </div>

            {/* Right Panel */}
            <div className="sm:w-1/2 w-full flex items-center justify-center bg-white px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    {alert.show && (
                        <div className={`px-4 py-3 rounded-md shadow-md text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <p className="text-sm font-medium">{alert.message}</p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-center text-2xl font-semibold text-gray-900">Create an Account</h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                maxLength={20}
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                maxLength={20}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                maxLength={20}
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">firstName</label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                maxLength={20}
                                required
                                value={formData.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">LastName</label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                maxLength={20}
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                id="company"
                                name="company"
                                type="text"
                                maxLength={50}
                                value={formData.company}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Projects</label>
                            {formData.projects.map((project, index) => (
                                <input
                                    key={index}
                                    name="projects"
                                    type="text"
                                    maxLength={100}
                                    placeholder={`Project ${index + 1}`}
                                    value={project}
                                    onChange={(e) => handleChange(e, index)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                                />
                            ))}
                            <button
                                type="button"
                                onClick={addProjectField}
                                className="text-sm text-blue-600 hover:underline mt-1"
                            >
                                + Add another project
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 text-white font-semibold rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registering...
                </span>
                            ) : (
                                'Register'
                            )}
                        </button>

                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-zinc-600 hover:text-zinc-800 hover:underline font-bold transition">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}