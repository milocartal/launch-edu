import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      'Inter': ['inter', 'sans-serif'],
    },
  },
  plugins: [],
  
} satisfies Config;
