import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const token = useCookie("token").value;

  if (userStore.userProfile) {
    return;
  }

  if (!token) {
    return navigateTo("/auth");
  }

  if (token && !userStore.userProfile) {
    try {
      await userStore.getUserMe();
    } catch {
      return navigateTo("/auth");
    }
  }
});
