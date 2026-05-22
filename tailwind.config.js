/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
  ],
  daisyui: {
    themes: [
      {
        retro: {
          ...require("daisyui/src/theming/themes")["retro"],

        },
      },
    ],
  }
}
