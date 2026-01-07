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
        primary: {
          DEFAULT: '#115e59', // Teal-800
          light: '#134e4a',
          dark: '#0f766e',
        },
        secondary: {
          DEFAULT: '#cb9b51', // Gold
        }
      },
    },
  },
  plugins: [],
};
export default config;
