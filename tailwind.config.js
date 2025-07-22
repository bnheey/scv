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
        "scv-light-pink": "#f9ebeb",
        "scv-green": "#a0cb7c",
        "scv-light-green": "#d9efc9",
        "scv-blue": "#60a5fa",
        "scv-light-blue": "#93c5fd",
        "scv-ash-blue": "#769cbf",
        "scv-ash-purple": "#a38cc6",
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(1rem) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shine: {
          "0%, 100%": {
            filter: "brightness(1.05)",
            backgroundPosition: "0% 50%",
          },
          "50%": {
            filter: "brightness(1.35)",
            backgroundPosition: "100% 50%",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-4px)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out",
        slideOut: "slideOut 0.5s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
        shine: "shine 2s infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
