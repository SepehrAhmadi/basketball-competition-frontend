export const ROLES = {
  ADMIN: "ADMIN",
  ORG_MANAGER: "ORG_MANAGER",
  COACH: "COACH",
  PLAYER: "PLAYER",
  REFEREE: "REFEREE",
  PUBLIC: "PUBLIC",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];