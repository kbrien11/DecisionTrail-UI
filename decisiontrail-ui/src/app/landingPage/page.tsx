
'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-6 border-b">
                <h1 className="text-xl font-semibold tracking-tight">
                    <Link href="/">
                        <Image src="/company_logo.png" alt="DecisionTrail Logo" width={220} height={90} />
                    </Link>
                </h1>


                <div className="space-x-4">
                    <Link href="/login">
      <span className="text-sm font-medium text-gray-700 hover:text-black transition duration-150 ease-in-out">
        Login
      </span>
                    </Link>
                    <Link href="/register">
      <span className="text-sm font-medium text-white bg-black px-4 py-1.5 rounded hover:bg-gray-800 transition">
        Register
      </span>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-6 py-20">
                <h2 className="text-4xl font-semibold mb-4">Strategic Memory for Modern Teams</h2>
                <p className="text-lg text-gray-600 max-w-xl mb-8">
                    Capture, recall, and analyze decisions across your organization. Build clarity, accountability, and momentum—without changing how your team works.
                </p>
                <Link href="/register">
                    <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
                        Get Started
                    </button>
                </Link>
            </section>

            {/* Audit Trail Preview */}
            <section className="px-6 py-16 bg-white">
                <h3 className="text-2xl font-semibold text-center mb-10">See the Trail</h3>
                <div className="relative border-l border-gray-300 pl-6 max-w-2xl mx-auto">
                    {[
                        {
                            summary: "Shift Q4 roadmap to prioritize SOAR integration",
                            timestamp: "2025-09-01 10:32 AM",
                            tags: "SOAR, roadmap",
                        },
                        {
                            summary: "Approve BEN questionnaire for Medicare pilot",
                            timestamp: "2025-09-12 2:15 PM",
                            tags: "BEN UI, Medicare",
                        },
                        {
                            summary: "Flag review for strategic alignment on ops handoff",
                            timestamp: "2025-09-20 9:47 AM",
                            tags: "review_flag, ops",
                        },
                    ].map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="mb-8 relative"
                        >
                            {/* Trail dot */}
                            <div className="absolute -left-3 top-1 w-6 h-6 bg-black rounded-full border-2 border-white shadow" />

                            {/* Decision content */}
                            <div className="bg-gray-50 p-4 rounded shadow-sm">
                                <h4 className="text-md font-semibold">{d.summary}</h4>
                                <p className="text-sm text-gray-600">{d.timestamp}</p>
                                <p className="text-xs text-gray-500 mt-1">Tags: {d.tags}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-50 py-16 px-6">
                <h3 className="text-2xl font-semibold text-center mb-10">What Teams Are Saying</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            quote: "We finally have a way to track why decisions were made—and revisit them with context.",
                            name: "Ava R., Product Lead",
                        },
                        {
                            quote: "DecisionTrail helped us reduce rework and align faster across teams.",
                            name: "Jordan M., Engineering Manager",
                        },
                        {
                            quote: "Slack-native capture means zero friction. Our team actually uses it.",
                            name: "Priya S., Strategy Director",
                        },
                    ].map((t, i) => (
                        <div key={i} className="bg-white p-6 rounded shadow">
                            <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
                            <p className="text-sm font-medium text-gray-900">{t.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto p-6 text-center text-sm text-gray-500 border-t">
                &copy; {new Date().getFullYear()} DecisionTrail. All rights reserved.
            </footer>
        </div>
    );
}