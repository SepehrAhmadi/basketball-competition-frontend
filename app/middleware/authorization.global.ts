import { useHandlerStore } from "~/store/handler";
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
import { usePermissions } from "~/composables/usePermissions";
import type { RoleType } from "~/constants/roles";
import { ROLES } from "~/constants/roles";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const handlerStore = useHandlerStore();

  if (!authStore.isAuthResolved) {
    await authStore.resolveAuth();
  }

  const requiredRoles = to.meta.roles as RoleType[] | undefined;
  if (!requiredRoles) return;

  const { hasAnyRole } = usePermissions();
  if (!hasAnyRole(requiredRoles)) {
    const isGuest =
      requiredRoles.includes(ROLES.PUBLIC) === false && !userStore.userProfile;
    return navigateTo(isGuest ? "/auth" : "/403");
  }

  // unauthorized (set by axios plugin interceptor on failed refresh)
  if (handlerStore.unauthorized) {
    handlerStore.clearFlags();
    return navigateTo("/auth");
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

  // logged-in users should not see the auth page
  if (to.path === "/auth" && userStore.userProfile) {
    return navigateTo("/");
  }
});
