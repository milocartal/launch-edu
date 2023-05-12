import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'Inter': ['Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
