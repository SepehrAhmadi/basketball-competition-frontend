import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "vue-sonner/style.css"],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
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
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});
