import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.onrender.com', // Permite as imagens do seu back-end no Render
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Permite as imagens do seu back-end local
      },
    ],
  },
};

export default nextConfig;