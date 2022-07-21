module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};

// import("./src/lib/themesList.js")
//   .then(({ themes }) => {
//     module.exports.daisyui.themes = themes;
//   })
//   .catch((err) => {
//     console.log(err);
//   });
