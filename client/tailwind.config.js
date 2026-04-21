/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        accent: "#f97316",
        glow: "#22d3ee",
        cream: "#fff7ed",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.15)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 35%), radial-gradient(circle at right, rgba(249,115,22,0.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

