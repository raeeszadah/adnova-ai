import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthStatusToast } from "@/components/auth/AuthStatusToast";
import { clerkAppearance } from "@/lib/clerk-appearance";
import {
  CLERK_AFTER_AUTH_URL,
  CLERK_SIGN_IN_URL,
  CLERK_SIGN_UP_URL,
} from "@/lib/clerk-config";

export default function SignInPage() {
  return (
    <AuthShell variant="sign-in">
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path={CLERK_SIGN_IN_URL}
        signUpUrl={CLERK_SIGN_UP_URL}
        fallbackRedirectUrl={CLERK_AFTER_AUTH_URL}
        forceRedirectUrl={CLERK_AFTER_AUTH_URL}
      />
      <AuthStatusToast />
    </AuthShell>
  );
}
