import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#00a2ff',      // Primária (Correria Blue)
          navy: '#27354c',      // Secundária (Correria Navy)
          light: '#f8fafc',     // Fundo Clean
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;