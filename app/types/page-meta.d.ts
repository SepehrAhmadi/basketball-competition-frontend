import type { RoleType } from "~/constants/roles";

declare module "#app" {
  interface PageMeta {
    roles?: RoleType[];
  }
}

export {};
