'use client';

import {JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, Suspense, useEffect, useState} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";
import EditDecisionModal from "@/app/components/EditDecisionModal";
import {Decision} from "@/app/types/Decision";



export default function DashboardClientPage() {
    const [search, setSearch] = useState('');
    const [filterOwner, setFilterOwner] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [decisions, setDecisions] = useState([]);
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState('All');
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
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


    if (company) params.append("company_domain", company);
    if (page) params.append("page", String(page));
    if (itemsPerPage) params.append("page_size", String(itemsPerPage));
    if (project) params.append("project", project);

    if (team != null) {
        params.append('team', team);
    }




    if (search) params.append('search', search);
    if (filterOwner) params.append('owner', filterOwner);
    // if (filterStatus) params.append('confidence', filterStatus);
    if (activeTeam && activeTeam !== 'All') params.append('team', activeTeam);

    const handleEditClick = (decision:Decision) => {
        setSelectedDecision(decision);
        setIsModalOpen(true);
    };


    useEffect(() => {
        console.log("Fetching page:", page);

        const fetchDecisions = async () => {
            try {
                if (filterStatus) {
                    params.append("status", filterStatus);
                }
                const url = `https://decisiontrail.onrender.com/slack/api/decisions?${params.toString()}`;

                const res = await fetch(url, {
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
    }, [page,itemsPerPage,filterStatus,refreshKey]);

 ;


    console.log('decisions', decisions);
    const filteredDecisions = decisions
        .filter((d:Decision) =>
            d.summary.toLowerCase().includes(search.toLowerCase()) &&
            (filterOwner ? d.owner === filterOwner : true) &&
            (activeTeam !== 'All' ? d.team === activeTeam : true)
        );

    const handleSave = async (updated: Decision) => {

        try {handleSave
            const res = await fetch(`https://decisiontrail.onrender.com/slack/api/decisions/update/${updated.id}`,
                {
                    method: "PUT",
                    credentials: 'include', // ✅ sends cookies
                    headers: {"Content-Type": "application/json"},
                    body:JSON.stringify( {
                        summary: updated.summary,
                        status: updated.status,
                        rationale: updated.rationale
                    }),
                });

            if (!res.ok) throw new Error("Failed to update decision");

            setAlert({ type: "success", message: "Decision updated successfully!" });
            setTimeout(() => {
                setAlert(null);
                setRefreshKey((prev) => prev + 1); // triggers useEffect
                setIsModalOpen(false); // close modal
            }, 3000);
        } catch (err) {
            setAlert({ type: "error", message: "Something went wrong. Please try again." });
            setTimeout(() => setAlert(null), 3000);
        }
    };




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
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    {alert && (
                        <div
                            className={`mb-4 px-4 py-2 rounded text-sm ${
                                alert.type === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {alert.message}
                        </div>
                    )}

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
                                <div className="flex items-center justify-between mb-4">
                                    {/* Team badge */}
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full shadow-sm">
    {d.team}
  </span>

                                    {/* Status badge */}
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                            d.status === 'open'
                                                ? 'bg-green-100 text-green-700'
                                                : d.status === 'closed'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : d.status === 'cancelled'
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-red-100 text-red-700'
                                        }`}
                                    >
    {d.status.toUpperCase()}
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

                                <div className="flex items-center justify-between">
                                    {/* Jira Link */}
                                    <a
                                        href={d.jiraUrl}
                                        target="_blank"
                                        className="inline-block text-sm font-medium text-blue-600 hover:text-indigo-600 transition-colors"
                                    >
                                        🔗 View Jira Issue
                                    </a>

                                    {/* Conditional Action Icon */}
                                    {d.status === 'open' ? (
                                        <>
                                            <button onClick={() => handleEditClick(d)} title="Edit">✏️</button>
                                            {selectedDecision && <EditDecisionModal
                                                isOpen={isModalOpen}
                                                onClose={() => setIsModalOpen(false)}
                                                decision={selectedDecision}
                                                onSave={handleSave}/> }</>
                                    ) : d.status === 'closed' || d.status === 'cancelled' ? (
                                        <button
                                            onClick={() => console.log(d.id)}
                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    ) : null}
                                </div>
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