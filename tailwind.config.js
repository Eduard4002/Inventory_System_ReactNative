/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: {
          primary: "#030014",
          secondary: "#151312",
        },
        text: {
          title: "#ffffff",
          primary: "#00171f",
          placeholder: "#b8b8b8",
        },
        light: {
          100: "#D6C7FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#929292ce",
          200: "#616161e8",
        },
        accent: {
          primary: "#ececec",
          dark: "#363636",
        },
      },
    },
  },
  plugins: [],
};
