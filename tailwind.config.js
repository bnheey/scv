/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard-Regular", "sans-serif"],
        "pretendard-medium": ["Pretendard-Medium", "sans-serif"],
        "pretendard-bold": ["Pretendard-Bold", "sans-serif"],
      },
      colors: {
        "scv-pink": "#dd9595",
        "scv-green": "#a0cb7c",
        "scv-blue": "#60a5fa",
        "scv-light-blue": "#93c5fd",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out",
        slideOut: "slideOut 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
