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
        marrom: {
          50: "#fdf8f0",
          100: "#f9edd8",
          200: "#f2d8b0",
          300: "#e8bd82",
          400: "#dc9b52",
          500: "#d4812e",
          600: "#c56a23",
          700: "#a4511e",
          800: "#84411f",
          900: "#6b371c",
          950: "#3a1b0d",
        },
        terracota: {
          50: "#fdf4ef",
          100: "#fae5d3",
          200: "#f4c9a5",
          300: "#eca56d",
          400: "#e27a3d",
          500: "#d85e20",
          600: "#ca4815",
          700: "#a73614",
          800: "#872e17",
          900: "#6e2915",
          950: "#3b1208",
        },
        musgo: {
          50: "#f3f7ee",
          100: "#e4edd9",
          200: "#cbdcb6",
          300: "#a9c489",
          400: "#88aa5e",
          500: "#6b9040",
          600: "#527230",
          700: "#405829",
          800: "#354724",
          900: "#2e3d21",
          950: "#16200e",
        },
        creme: {
          50: "#fdfbf5",
          100: "#f9f3e3",
          200: "#f2e4c4",
          300: "#e8ce9b",
          400: "#dcb26f",
          500: "#d29a4d",
          600: "#c07f3a",
          700: "#9f6430",
          800: "#82512c",
          900: "#6b4326",
          950: "#3a2211",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
