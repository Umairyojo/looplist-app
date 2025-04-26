/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // App directory ke sare files
      "./pages/**/*.{js,ts,jsx,tsx}", // Agar pages folder hai
      "./components/**/*.{js,ts,jsx,tsx}", // Components folder
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };