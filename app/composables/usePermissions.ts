// composables/usePermissions.ts
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
import { ROLES, type RoleType } from "~/constants/roles";

export function usePermissions() {
  const userStore = useUserStore();

  const isAuthenticated = computed(() => !!userStore.userProfile);

  const currentRoles = computed<RoleType[]>(() =>
    isAuthenticated.value ? userStore.userProfile.roles : [ROLES.PUBLIC],
  );

  function hasRole(role: RoleType) {
    return currentRoles.value.includes(role);
  }

  function hasAnyRole(roles: RoleType[]) {
    return currentRoles.value.some((r) => roles.includes(r));
  }

  const isGuest = computed(() => hasRole(ROLES.PUBLIC));

  // helpers

  // profile permissions
  const canSetCoachInfo = computed(() => hasAnyRole([ROLES.COACH]));
  const canSetPlayerInfo = computed(() => hasAnyRole([ROLES.PLAYER]));
  const canSetRefereeInfo = computed(() => hasAnyRole([ROLES.REFEREE]));

  return {
    currentRoles,
    hasRole,
    hasAnyRole,
    isGuest,
    canSetCoachInfo,
    canSetPlayerInfo,
    canSetRefereeInfo,
  };
}
