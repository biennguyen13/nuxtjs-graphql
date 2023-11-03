// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    public: { GRAPHQL_URL: process.env.GRAPHQL_URL },
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
  modules: [
    "@nuxtjs/apollo",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-socket-io",
  ],
  io: {
    // Options
    sockets: [
      {
        name: "main",
        url: process.env.WS_URL,
        default: true,
      },
    ],
  },
  ui: {
    global: true,
  },
  colorMode: {
    preference: "light", // default value of $colorMode.preference
    fallback: "system", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "-mode",
    storageKey: "nuxt-color-mode",
  },
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
            // "X-Api-Cdb-token": "",
          },
        },
        httpEndpoint: process.env.GRAPHQL_URL,
      },
    },
  },
  css: [
    // CSS file in the project
    "~/assets/scss/main.scss",
  ],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: false,
    exposeLevel: 2,
    config: {},
    injectPosition: "first",
    viewer: true,
  },
})
