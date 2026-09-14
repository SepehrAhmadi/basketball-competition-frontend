import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const token = useCookie("token").value;

  // If profile already loaded, allow navigation
  if (userStore.userProfile) {
    return;
  }

  // No token at all → redirect to auth
  if (!token) {
    return navigateTo("/auth");
  }

  // Token exists but profile not loaded (e.g. page refresh) → fetch profile
  try {
    await userStore.getUserMe();
  } catch {
    // getUserMe already handles errors internally
  }

  // After fetching, check again
  if (!userStore.userProfile) {
    return navigateTo("/auth");
  }
});
