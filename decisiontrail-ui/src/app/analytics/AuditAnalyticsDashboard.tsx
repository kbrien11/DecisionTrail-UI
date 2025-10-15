'use client';

import {Suspense, useEffect, useState} from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell, PieLabelRenderProps,
} from 'recharts';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/Navbar";
import Footer from "@/app/Footer";




const AuditAnalyticsDashboard = () => {
    const [chartData, setChartData] = useState<TeamStats[]>([]);
    const [teamSummary, setTeamSummary] = useState<TeamSummary[]>([]);
    const [company, setCompany] = useState("");

    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const companyLogin = searchParams.get('company');
    const projects = sessionStorage.getItem('projects');
    const projectList = projects?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const [selectedProject, setSelectedProject] = useState(projectList[0]);

    type TeamSummary = {
        name: string;
        count: number;
        tags: string[];
    };

    const cleanedProject = selectedProject.replace(/\s+/g, '');
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [analyticsRes, summaryRes] = await Promise.all([


                    fetch(`https://decisiontrail.onrender.com/slack/api/analytics?company_domain=${companyLogin}&project=${cleanedProject}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Accept': 'application/json' },
                    }),
                    fetch(`https://decisiontrail.onrender.com/slack/api/getTeams?company_domain=${companyLogin}&project=${cleanedProject}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Accept': 'application/json' },
                    })
                ]);

                if (!analyticsRes.ok || !summaryRes.ok) throw new Error('One or more fetches failed');

                const analyticsData = await analyticsRes.json();
                const summaryData = await summaryRes.json();

                const formattedChart = analyticsData.teams.map((team: TeamStats) => ({
                    team: team.team,
                    Closed: team.Closed,
                    Open: team.Open
                }));

                setChartData(formattedChart);
                setCompany(analyticsData.company)
                setTeamSummary(summaryData.data);
            } catch (err) {
                console.error('Chart fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [selectedProject]);

    const tagColors = [
        "bg-blue-300",
        "bg-green-300",
        "bg-yellow-300",
        "bg-pink-300",
        "bg-purple-300",
        "bg-orange-300",
        "bg-teal-300"
    ];

    type TeamStats = {
        team: string;
        Closed: number;
        Open: number;
    };



    // your actual data



    const pieData = chartData.map(team => ({
        team: team.team,
        total: team.Closed + team.Open
    }));












    return (

        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow bg-gray-50 px-6 py-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mt-6 mb-8">
                    {/* Left: Logo + Project Selector */}
                    <div className="flex flex-col items-center sm:items-start">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="w-64 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {projectList.map((project) => (
                                <option key={project} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                            📊 Total Audits by Team
                            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full shadow-sm">
                        {company.charAt(0).toUpperCase() + company.slice(1).toLowerCase()}

  </span>
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow-sm">
  {selectedProject}
</span>
                            <span className="text-gray-500 italic">Updated this week</span>
                        </div>

                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        {pieData.length >0 ? <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                    labelStyle={{ fontWeight: "600", color: "#374151" }}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: "0.875rem", marginTop: "12px" }}
                                />
                                <Pie
                                    data={pieData}
                                    dataKey="total"
                                    nameKey="team"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}

                                    label={(props: { name?: string; percent?: number }) => {
                                        const name = props.name ?? "Unknown";
                                        const percent = props.percent ?? 0;
                                        return `${name}: ${(percent * 100).toFixed(0)}%`;
                                    }}
                                >
                                    <Cell fill="#1e3a8a" />
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#93c5fd" />
                                    {/* Add more <Cell /> if needed */}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>:<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <p className="text-lg font-semibold text-gray-800">
                                There are currently no Decision audits,
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                go make some Decisions!
                            </p>
                        </div> }

                    </div>



                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {teamSummary.map((team) => (
                        <div key={team.name} className="bg-white rounded-xl shadow-md overflow-hidden relative group transition-transform hover:-translate-y-1 hover:shadow-lg">

                            {/* Header */}
                            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-t" />
                            <div className="px-4 pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
                                    {team.name
                                        .split(" ")
                                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(" ")}
                                </h3>
                            </div>

                            {/* Body */}
                            <div className="p-4 pb-16">
                                <p className="text-sm text-gray-600 mb-4">
          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {team.count} {team.count === 1 ? "Audit" : "Audits"} This Year
          </span>
                                </p>

                                <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                                    {team.tags.map((tag: string, index: number) => (
                                        <li key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                                            <span className={`w-2 h-2 rounded-full ${tagColors[index % tagColors.length]}`} />
                                            <span className="text-xs">{tag}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="absolute bottom-4 right-4">
                                <a
                                    href={`/dashboard?team=${encodeURIComponent(team.name)}&company=${encodeURIComponent(company)}&project=${encodeURIComponent(cleanedProject)}`}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                                >
                                    View Audits →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuditAnalyticsDashboard;