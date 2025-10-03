import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/accounts/:path*",
                destination: "http://127.0.0.1:8000/accounts/:path*" // Added /api/ prefix
            },
            {
                source: "/slack/api/:path*",
                destination: "https://e6b0a5bb9a47.ngrok-free.app/slack/api/:path*"
            }

        ];
    }
};

export default nextConfig;