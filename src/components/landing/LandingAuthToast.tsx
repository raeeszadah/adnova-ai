"use client";

import { AuthStatusToast } from "@/components/auth/AuthStatusToast";

/** Shows auth toasts on landing (e.g. after sign-out redirect). */
export function LandingAuthToast() {
  return <AuthStatusToast />;
}
