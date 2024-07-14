import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F2F2F2",
          200: "#1d4757",
          800: "#003044",
        },
        primary: {
          ...colors.emerald,
        },
      },
      keyframes: {
        appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        growH: {
          "0%": { height: "0" },
          "100%": { height: "208px" },
        },
        growHSM: {
          "0%": { height: "0" },
          "100%": { height: "304px" },
        },
      },
    },
  },
  plugins: [],
};
