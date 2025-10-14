import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/accounts/:path*",
                destination: "https://decisiontrail.onrender.com/accounts/:path*" // Added /api/ prefix
            },
            {
                source: "/slack/api/:path*",
                destination: "https://decisiontrail.onrender.com/slack/api/:path*"
            }

        ];
    }
};

export default nextConfig;