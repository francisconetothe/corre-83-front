import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],

  // A regra do typescript continua válida, removemos apenas a do eslint
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // 👇 A MÁGICA: Desliga a otimização de imagem APENAS no seu computador para o localhost funcionar
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.onrender.com", // Permite as imagens do seu back-end no Render
      },
      {
        protocol: "http",
        hostname: "localhost", // Permite as imagens do seu back-end local
      },
    ],
  },
};

export default nextConfig;
