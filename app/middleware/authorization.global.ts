import { useHandlerStore } from "~/store/handler";
import { useAuthStore } from "~/store/auth";
import { usePermissions } from "~/composables/usePermissions";
import type { RoleType } from "~/constants/roles";

export default defineNuxtRouteMiddleware(async  (to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthResolved) {
    await authStore.resolveAuth()
  }

  const requiredRoles = to.meta.roles as RoleType[] | undefined
  if (!requiredRoles) return 

  const { hasAnyRole } = usePermissions()
  if (!hasAnyRole(requiredRoles)) {
    return navigateTo('/403')
  }


  const token = useCookie("token").value;
  const handlerStore = useHandlerStore();

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

  // guest guard: no token and not already on the auth page
  if (!token && to.path !== "/auth") {
    return navigateTo("/auth");
  }

  // logged-in users should not see the auth page
  if (token && to.path === "/auth") {
    return navigateTo("/");
  }
});
