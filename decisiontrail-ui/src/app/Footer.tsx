import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-zinc-900 text-gray-300 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left: Branding or Message */}
                <div className="text-sm text-center sm:text-left">
                    © {new Date().getFullYear()} DecisionTrail. All rights reserved.
                </div>

                {/* Right: Optional Links */}
                <div className="flex gap-4 text-sm">
                    <a href="/privacy" className="hover:text-white transition">Privacy</a>
                    <a href="/terms" className="hover:text-white transition">Terms</a>
                    <a href="/contact" className="hover:text-white transition">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;