'use client';

import {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState} from 'react';
import Link from 'next/link';




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
    const itemsPerPage = 2;

    const params = new URLSearchParams();


    params.append('company_domain', 'decisiontrail');
    params.append('page', page.toString());
    params.append('page_size', '2');



    if (search) params.append('search', search);
    if (filterOwner) params.append('owner', filterOwner);
    if (filterConfidence) params.append('confidence', filterConfidence);
    if (activeTeam && activeTeam !== 'All') params.append('team', activeTeam);


    useEffect(() => {
        const fetchDecisions = async () => {
            try {
                const res = await fetch('http://localhost:8000/slack/api/decisions?company_domain=decisiontrail&page=1&page_size=4', {
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
            } catch (err) {
                console.error('Fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDecisions();
    }, []);

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

    const paginatedDecisions = filteredDecisions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // @ts-ignore
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col p-6 space-y-6">
                <div className="text-2xl font-bold">DecisionAudit</div>
                <nav className="flex flex-col space-y-4 text-sm">
                    <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link>
                    <Link href="/teams" className="hover:text-zinc-300">Teams</Link>
                    <Link href="/settings" className="hover:text-zinc-300">Settings</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 px-8 py-10">
                {/* Company Name */}
                <h1 className="text-2xl font-bold text-zinc-800 mb-6">Acme Corp Audit Trail</h1>

                {/* Team Tabs */}
                <div className="flex gap-4 mb-6">
                    {teams.map((team, index) => (
                        <button
                            key={team}
                            onClick={() => setActiveTeam(team)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                activeTeam === team
                                    ? 'bg-zinc-800 text-white'
                                    : index % 2 === 0
                                        ? 'bg-blue-200 text-black font-bold hover:bg-blue-300'
                                        : 'bg-zinc-200 text-black font-bold hover:bg-zinc-300'
                            }`}
                        >
                            {team}
                        </button>
                    ))}
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
                    {paginatedDecisions.map((d: Decision) => (
                        <div
                            key={d.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl border-l-4 border-zinc-700 p-6 transition-transform hover:scale-[1.01]"
                        >
                            <h3 className="text-lg font-bold text-zinc-800 mb-2">{d.summary}</h3>
                            <p className="text-sm text-zinc-500 mb-1">{d.created_at}</p>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {d.tags
                                    ?.split(',')
                                    .map((tag: string, i: Key | null | undefined) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs bg-zinc-100 text-zinc-700 rounded-full"
                                        >
        {tag.trim()}
      </span>
                                    ))}
                            </div>

                            <p className="text-sm text-zinc-700 mb-2">
                                <span className="font-medium">Rationale:</span> {d.rationale}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-sm text-zinc-700 mb-2">
                                <p><span className="font-medium">Confidence:</span> {d.confidence}</p>
                                <p><span className="font-medium">Owner:</span> {d.owner}</p>
                                <p><span className="font-medium">Team:</span> {d.team}</p>
                            </div>

                            <a
                                href={d.jiraUrl}
                                target="_blank"
                                className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium"
                            >
                                🔗 View Jira Issue
                            </a>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-10 gap-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 font-bold"
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium text-gray-700">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * itemsPerPage >= filteredDecisions.length}
                        className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 font-bold"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}