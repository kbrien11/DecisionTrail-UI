'use client';

import {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, Suspense, useEffect, useState} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";


export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    const [search, setSearch] = useState('');
    const [filterOwner, setFilterOwner] = useState('');
    const [filterConfidence, setFilterConfidence] = useState('');
    const [decisions, setDecisions] = useState([]);
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState('All');
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
    });

    const params = new URLSearchParams();

    const searchParams = useSearchParams();
    const team = searchParams.get('team');
    const company = searchParams.get('company');
    const project = searchParams.get('project');


    params.append('company_domain', 'decisiontrail');
    params.append('page', page.toString());
    params.append('page_size', '4');
    if (team != null) {
        params.append('team', team);
    }




    if (search) params.append('search', search);
    if (filterOwner) params.append('owner', filterOwner);
    if (filterConfidence) params.append('confidence', filterConfidence);
    if (activeTeam && activeTeam !== 'All') params.append('team', activeTeam);


    useEffect(() => {
        console.log("Fetching page:", page);

        const fetchDecisions = async () => {
            try {
                const res = await fetch(`https://decisiontrail.onrender.com/slack/api/decisions?company_domain=${company}&page=${page}&page_size=${itemsPerPage}&project=${project}&team=${team}`, {
                    method: 'GET',
                    credentials: 'include', // ✅ sends cookies
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Fetch failed:', res.status, errorText);
                    throw new Error('Failed to fetch decisions');
                }

                const data = await res.json();
                console.log('Fetched decisions:', data);
                setDecisions(data.decisions);
                setTeams(data.teams);
                setPagination({
                    totalPages: data.total_pages,
                    currentPage: data.current_page,
                    hasNext: data.has_next,
                    hasPrevious: data.has_previous,
                });
            } catch (err) {
                console.error('Fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDecisions();
    }, [page,itemsPerPage]);

    type Decision = {
        id: number;
        summary: string;
        created_at: string;
        tags: string;
        rationale: string;
        confidence: string;
        owner: string;
        team: string;
        jiraUrl: string;
    };

    console.log('decisions', decisions);
    const filteredDecisions = decisions
        .filter((d:Decision) =>
            d.summary.toLowerCase().includes(search.toLowerCase()) &&
            (filterOwner ? d.owner === filterOwner : true) &&
            (filterConfidence ? d.confidence === filterConfidence : true) &&
            (activeTeam !== 'All' ? d.team === activeTeam : true)
        );




    return (

        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 bg-gray-100">

                {/* Sidebar */}
                <aside className="w-64 bg-gradient-to-b from-blue-600 via-indigo-500 to-purple-500 text-white flex flex-col p-6 space-y-6 rounded-r-xl shadow-lg">
                    <div className="text-2xl font-bold tracking-wide">DecisionAudit</div>
                    <nav className="flex flex-col space-y-4 text-sm">
                        {company && project && (
                            <Link
                                href={`/analytics?company=${encodeURIComponent(company)}&projects=${encodeURIComponent(project)}`}
                                className="hover:text-white/80 transition-colors"
                            >
                                Analytics
                            </Link>
                        )}
                        <Link href="/teams" className="hover:text-white/80 transition-colors">Teams</Link>
                        <Link href="/settings" className="hover:text-white/80 transition-colors">Settings</Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-8 pt-10 pb-0">
                    {/* Company Name */}
                    <h1 className="text-2xl font-bold text-zinc-800 mb-6">
                        {company
                            ? company.charAt(0).toUpperCase() + company.slice(1).toLowerCase()
                            : "Company"}
                    </h1>
                    <div className="flex gap-4 mb-6">
  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-sm">
    {team}
  </span>
                    </div>

                    {/* Search + Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search decisions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none"
                        />

                        <div className="flex gap-4">
                            <select
                                value={filterOwner}
                                onChange={(e) => setFilterOwner(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">All Owners</option>
                                <option value="Keith">Keith</option>
                                <option value="Sasha">Sasha</option>
                            </select>

                            <select
                                value={filterConfidence}
                                onChange={(e) => setFilterConfidence(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">All Confidence</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Decision Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDecisions.map((d: Decision) => (
                            <div
                                key={d.id}
                                className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-[1.01] p-6"
                            >
                                {/* Gradient left border */}
                                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-600 via-indigo-500 to-purple-500 rounded-l" />

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-zinc-800 mb-3 leading-tight tracking-tight">
                                    {d.summary}
                                </h3>

                                {/* Team pill */}
                                <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full shadow-sm">
          {d.team}
        </span>
                                </div>

                                {/* Date */}
                                <p className="text-xs text-zinc-500 mb-4">
                                    {new Date(d.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>

                                {/* Tags */}
                                {d.tags && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {d.tags.split(',').map((tag: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 text-xs bg-zinc-100 text-zinc-700 rounded-full"
                                            >
              {tag.trim()}
            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Rationale */}
                                <p className="text-sm text-zinc-700 mb-4 leading-relaxed">
                                    <span className="font-medium text-zinc-800">Rationale:</span> {d.rationale}
                                </p>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600 mb-4">
                                    <p><span className="font-medium text-zinc-800">Confidence:</span> {d.confidence}</p>
                                    <p><span className="font-medium text-zinc-800">Owner:</span> {d.owner}</p>
                                </div>

                                {/* Jira Link */}
                                <a
                                    href={d.jiraUrl}
                                    target="_blank"
                                    className="inline-block text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors"
                                >
                                    🔗 View Jira Issue
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 px-4 gap-6">
                        {/* Page Controls */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={!pagination.hasPrevious}
                                className="px-4 py-2 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-md hover:opacity-90 disabled:opacity-50 font-semibold transition"
                            >
                                ← Prev
                            </button>
                            <span className="text-sm font-medium text-gray-700">
      Page <span className="font-bold">{pagination.currentPage}</span> of <span className="font-bold">{pagination.totalPages}</span>
    </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.hasNext}
                                className="px-4 py-2 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-md hover:opacity-90 disabled:opacity-50 font-semibold transition"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Items Per Page Selector */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="itemsPerPage" className="text-sm text-gray-600 font-medium">
                                Items per page:
                            </label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setPage(1); // reset to first page
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {[4, 6, 8, 10, 12].map((count) => (
                                    <option key={count} value={count}>
                                        {count}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>

    );
}