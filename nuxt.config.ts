import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "vue-sonner/style.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
  ],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_PUBLIC_API_URL,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  pwa: {
    registerType: "prompt",

    manifest: {
      id: "/",
      name: "Basketball Competition",
      short_name: "Basketball",
      description: "Basketball Competition Management",
      lang: "fa",
      dir: "rtl",

      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait",

      theme_color: "#0f172a",
      background_color: "#0f172a",

      icons: [
        {
          src: "/pwa/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa/maskable-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },

    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,ttf,woff}"],

      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
      ],
    },

    devOptions: {
      enabled: false,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});
