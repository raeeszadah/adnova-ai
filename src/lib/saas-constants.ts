/** SaaS defaults — applied to newly created users only. */
export const FREE_TIER_CREDITS = 2;
export const DEFAULT_PLAN = "FREE";
export const PRO_PLAN_MAX_DISPLAY_CREDITS = 50;

export type AppRole = "user" | "admin";

export function isAdminRole(role: unknown): role is "admin" {
  return role === "admin";
}
