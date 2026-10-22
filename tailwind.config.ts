import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F6F0E6",
        paper: "#FFFBF5",
        ink: "#3A2618",
        bark: "#6B4A32",
        leaf: "#2F6B45",
        "leaf-dark": "#234F34",
        sand: "#E4D3BC",
        clay: "#8C4A32",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
