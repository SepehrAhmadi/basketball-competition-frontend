// plugins/auth-resolve.ts
import { useAuthStore } from "~/store/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  await nuxtApp.runWithContext(() => authStore.resolveAuth());
});