export const ROLES = {
  ADMIN: "ADMIN",
  ORG_MANAGER: "ORG_MANAGER",
  COACH: "COACH",
  PLAYER: "PLAYER",
  REFEREE: "REFEREE",
  PUBLIC: "PUBLIC",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const AUTHENTICATED_ROLES: RoleType[] = [
  ROLES.ADMIN,
  ROLES.ORG_MANAGER,
  ROLES.COACH,
  ROLES.PLAYER,
  ROLES.REFEREE,
];
