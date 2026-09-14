// composables/usePermissions.ts
import { useAuthStore } from "~/store/auth";
import { useUserStore } from "~/store/user";
import { ROLES, type RoleType } from "~/constants/roles";

export function usePermissions() {
  const authStore = useAuthStore();
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
  const canAddAndEditOrganization = computed(() =>
    hasAnyRole([ROLES.ORG_MANAGER]),
  );
  const canDeleteOrganization = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canAddAndEditTeam = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canDeleteTeam = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canAddAndEditPlayer = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canDeletePlayer = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canAddAndEditCoach = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));
  const canDeleteCoach = computed(() => hasAnyRole([ROLES.ORG_MANAGER]));

  return {
    currentRoles,
    hasRole,
    hasAnyRole,
    isGuest,
    canSetCoachInfo,
    canSetPlayerInfo,
    canSetRefereeInfo,
    canAddAndEditOrganization,
    canDeleteOrganization,
    canAddAndEditTeam,
    canDeleteTeam,
    canAddAndEditPlayer,
    canDeletePlayer,
    canAddAndEditCoach,
    canDeleteCoach,
  };
}
