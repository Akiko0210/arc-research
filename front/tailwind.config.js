/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // "conic-gradient(from 180deg,#d53e33 0deg 90deg,#fbb300 90deg 180deg,#377af5 180deg 270deg,#399953 270deg 360deg)",
      },
      colors: {
        background: "rgba(7, 10, 36, 0.1)",
      },
    },
  },
  plugins: [],
};
