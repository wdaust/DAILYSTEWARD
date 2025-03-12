/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7E57C2", // Purple from the image
          50: "#F5F2FC",
          100: "#EBE4F9",
          200: "#D7C9F3",
          300: "#C3AEEC",
          400: "#AF93E6",
          500: "#9B78DF",
          600: "#7E57C2", // Main purple
          700: "#6A46A9",
          800: "#563590",
          900: "#422477",
        },
        secondary: {
          DEFAULT: "#F5F5F7", // Light gray background
          50: "#FFFFFF",
          100: "#F9F9FA",
          200: "#F5F5F7", // Main light gray
          300: "#E5E5E7",
          400: "#D1D1D6",
          500: "#BCBCC4",
          600: "#A7A7B3",
          700: "#8E8E9F",
          800: "#75758A",
          900: "#5C5C75",
        },
        neutral: {
          DEFAULT: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.05)",
        nav: "0 -2px 10px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
