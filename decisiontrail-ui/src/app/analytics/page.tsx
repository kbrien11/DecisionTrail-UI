'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';





// const mockTeams = [
//     {
//         name: 'Finance',
//         count: 73,
//         tags: ['Budget', 'Expense', 'Forecast'],
//     },
//     {
//         name: 'Operations',
//         count: 52,
//         tags: ['Capacity', 'Contract', 'Vendor'],
//     },
//     {
//         name: 'Legal',
//         count: 50,
//         tags: ['Compliance', 'Policy', 'Vendor'],
//     },
//     {
//         name: 'Product',
//         count: 42,
//         tags: ['Labeling', 'Launch', 'QA'],
//     },
//     {
//         name: 'Sales',
//         count: 30,
//         tags: ['Pipeline', 'Contract', 'Vendor'],
//     },
// ];




const AuditAnalyticsDashboard = () => {
    const [chartData, setChartData] = useState([]);
    const [teamSummary, setTeamSummary] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [analyticsRes, summaryRes] = await Promise.all([
                    fetch('http://localhost:8000/slack/api/analytics?company_domain=decisiontrail', {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Accept': 'application/json' },
                    }),
                    fetch('http://localhost:8000/slack/api/getTeams?company_domain=decisiontrail', {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Accept': 'application/json' },
                    })
                ]);

                if (!analyticsRes.ok || !summaryRes.ok) throw new Error('One or more fetches failed');

                const analyticsData = await analyticsRes.json();
                const summaryData = await summaryRes.json();

                const formattedChart = analyticsData.teams.map((team: any) => ({
                    team: team.team,
                    Closed: team.Closed,
                    Open: team.Open
                }));

                setChartData(formattedChart);
                setTeamSummary(summaryData.data);
            } catch (err) {
                console.error('Chart fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    // useEffect(() => {
    //     const fetchChartData = async () => {
    //         try {
    //             const res = await fetch('http://localhost:8000/slack/api/analytics?company_domain=decisiontrail', {
    //                 method: 'GET',
    //                 credentials: 'include',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                 },
    //             });
    //
    //             if (!res.ok) throw new Error('Failed to fetch chart data');
    //             const data = await res.json();
    //
    //             // Transform backend format to Recharts format
    //             const formatted = data.teams.map((team: any) => ({
    //                 team: team.team,
    //                 Closed: team.Closed,
    //                 Open: team.Open
    //             }));
    //
    //             setChartData(formatted);
    //         } catch (err) {
    //             console.error('Chart fetch error:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchChartData();
    // }, []);

    const tagColors = [
        "bg-blue-300",
        "bg-green-300",
        "bg-yellow-300",
        "bg-pink-300",
        "bg-purple-300",
        "bg-orange-300",
        "bg-teal-300"
    ];


    // @ts-ignore
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Audit Analytics</h1>
                <div className="flex gap-4">
                    {['Date Range', 'Audit Type', 'Status', 'Confidence Level'].map((label) => (
                        <select key={label} className="bg-blue-900 text-white px-3 py-2 rounded text-sm">
                            <option>{label}</option>
                        </select>
                    ))}
                </div>
            </div>

            {/* Bar Chart Placeholder */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Audits By Team</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="team" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Closed" stackId="a" fill="#1e3a8a" />
                        <Bar dataKey="Open" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Review" stackId="a" fill="#93c5fd" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/*<div className="bg-white p-6 rounded shadow mb-8">*/}
            {/*    <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Audits By Team</h2>*/}
            {/*    <div className="grid grid-cols-5 gap-6 items-end h-48">*/}
            {/*        {mockTeams.map((team, index) => {*/}
            {/*            const closed = Math.floor(team.count * 0.6);*/}
            {/*            const open = Math.floor(team.count * 0.25);*/}
            {/*            const review = team.count - closed - open;*/}
            {/*            return (*/}
            {/*                <div key={team.name} className="flex flex-col items-center">*/}
            {/*                    <div className="w-10 h-full flex flex-col justify-end">*/}
            {/*                        <div className="bg-blue-900 w-full" style={{ height: `${closed}px` }} />*/}
            {/*                        <div className="bg-blue-600 w-full" style={{ height: `${open}px` }} />*/}
            {/*                        <div className="bg-blue-300 w-full" style={{ height: `${review}px` }} />*/}
            {/*                    </div>*/}
            {/*                    <span className="mt-2 text-sm text-gray-700">{team.name}</span>*/}
            {/*                </div>*/}
            {/*            );*/}
            {/*        })}*/}
            {/*    </div>*/}
            {/*    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">*/}
            {/*        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-900" /> Closed</div>*/}
            {/*        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600" /> Open</div>*/}
            {/*        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-300" /> In Review</div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {teamSummary.map((team) => (
                    <div key={team.name} className="bg-white border rounded p-4 pb-12 shadow-sm relative">                        <h3 className="text-lg font-semibold text-gray-800">
                            {team.name
                                .split(" ")
                                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {team.count} {team.count === 1 ? "Audit" : "Audits"} This Year
                        </p>
                        <ul className="text-sm text-gray-700 mb-2">
                            {team.tags.map((tag: string, index: number) => (
                                <li key={tag} className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${tagColors[index % tagColors.length]}`} />
                                    {tag}
                                </li>
                            ))}
                        </ul>

                        <div className="absolute bottom-4 right-4 p-2">
                            <a
                                href={`/team/${team.name.toLowerCase()}`}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                View Audits
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditAnalyticsDashboard;