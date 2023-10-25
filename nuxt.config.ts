// https://nuxt.com/docs/api/configuration/nuxt-config
const environment = process.env.ENV_MODE
const envSettings = require(`./env.${environment ?? "production"}.js`)

export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    public: { ...envSettings },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  app: {
    head: {
      title: "Nuxjs",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { hid: "type", property: "type", content: "website" },
        { hid: "og-type", property: "og:type", content: "website" },
        {
          hid: "title",
          property: "title",
          content: "",
        },
        {
          hid: "og-title",
          property: "og:title",
          content: "",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [],
      noscript: [],
    },
  },
  devServer: {
    port: 3001,
  },
  modules: ["@nuxtjs/apollo"],
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      default: {
        tokenName: "apollo:graphql.token",
        httpLinkOptions: {
          // credentials: "include",
          headers: {
            "X-Api-Cdb-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlwIjoiMTI3LjAuMC4xIn0sImlhdCI6MTY5ODIzMTg4OCwiZXhwIjoxNjk4MjM1NDg4fQ.eLEJSCP_bz1lePJNyO5BljOyGJCQ8nMWl96WBzimFq0",
          },
        },
        httpEndpoint: envSettings.GRAPHQL_URL,
      },
    },
  },
  css: [
    // CSS file in the project
    "~/assets/scss/main.scss",
  ],
})
