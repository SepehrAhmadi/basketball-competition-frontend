import { useHandlerStore } from "~/store/handler";

export default defineNuxtRouteMiddleware((to) => {
  const handlerStore = useHandlerStore();

  // unauthorized (set by axios plugin interceptor on failed refresh)
  if (handlerStore.unauthorized) {
    handlerStore.clearFlags();
    if (to.path === "/auth" || to.path.startsWith("/auth/")) {
      return;
    }
    return navigateTo({ path: "/auth", query: { redirect: to.fullPath } });
  }

  // forbidden (set by axios plugin interceptor on 403)
  if (handlerStore.forbidden) {
    handlerStore.clearFlags();
    return navigateTo("/403");
  }

  // redirect instruction coming from backend response payload
  if (handlerStore.redirectTo) {
    const redirect = handlerStore.redirectTo;
    handlerStore.clearFlags();
    return navigateTo(redirect);
  }
});
