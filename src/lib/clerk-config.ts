/** Central Clerk routing — also set in Clerk Dashboard → Paths */

export const CLERK_SIGN_IN_URL = "/sign-in";
export const CLERK_SIGN_UP_URL = "/sign-up";
export const CLERK_AFTER_AUTH_URL = "/auth/redirect";
export const CLERK_USER_DASHBOARD_URL = "/dashboard";
export const CLERK_ADMIN_DASHBOARD_URL = "/admin/dashboard";

export const clerkProviderProps = {
  signInUrl: CLERK_SIGN_IN_URL,
  signUpUrl: CLERK_SIGN_UP_URL,
  signInFallbackRedirectUrl: CLERK_AFTER_AUTH_URL,
  signUpFallbackRedirectUrl: CLERK_AFTER_AUTH_URL,
  afterSignOutUrl: "/?auth=signed-out",
} as const;
