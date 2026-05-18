/**
 * Clerk ↔ Convex JWT (template name: "convex").
 * Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard (Settings → Environment)
 * to match Clerk → API keys → Frontend API URL / issuer.
 *
 * JWT custom claims (Clerk template):
 *   "metadata": { "role": "{{user.public_metadata.role}}" }
 */
const clerkIssuer =
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  "https://moved-robin-68.clerk.accounts.dev";

export default {
  providers: [
    {
      domain: clerkIssuer,
      applicationID: "convex",
    },
  ],
};
