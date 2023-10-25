const plugin = require("tailwindcss/plugin")

module.exports = {
  plugins: [
    plugin(({ addBase, addComponents, addUtilities, theme }) => {
      const isSP = `@media (max-width: ${theme("screens").md})`
      addBase({
        html: {},
        "*": {
          fontFamily: `"Noto Sans JP", sans-serif !important`,
          lineHeight: "170%",
        },
        p: {
          fontSize: theme("fontSize.sm"),
        },
      })
      addComponents({})
      addUtilities({})
    }),
  ],
}
