import { AppIcon } from "@/components/icons";
import { SocialIcon } from "@/components/icons/SocialIcon";

export function AuthHints({
  variant,
}: {
  variant: "sign-in" | "sign-up";
}) {
  if (variant === "sign-in") {
    return (
      <aside className="footer-glass hidden w-full max-w-sm rounded-2xl border border-border p-6 lg:block">
        <h2 className="mb-4 font-headline text-lg font-bold text-foreground">
          Sign in securely
        </h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <AppIcon name="mail" size="lg" className="text-primary shrink-0" />
            Use email + password or continue with Google
          </li>
          <li className="flex gap-2">
            <AppIcon name="lock_reset" size="lg" className="text-primary shrink-0" />
            Forgot password? Use the link below the password field in the form
          </li>
          <li className="flex gap-2">
            <AppIcon name="verified_user" size="lg" className="text-primary shrink-0" />
            After email verification you&apos;ll be redirected to your dashboard
          </li>
        </ul>
      </aside>
    );
  }

  return (
    <aside className="footer-glass hidden w-full max-w-sm rounded-2xl border border-border p-6 lg:block">
      <h2 className="mb-4 font-headline text-lg font-bold text-foreground">
        Create your account
      </h2>
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li className="flex gap-2">
          <AppIcon name="password" size="lg" className="text-primary shrink-0" />
          Use a unique password (8+ characters). Avoid common or leaked passwords.
        </li>
        <li className="flex gap-2">
          <AppIcon name="mark_email_read" size="lg" className="text-primary shrink-0" />
          You&apos;ll receive a verification code by email after signing up
        </li>
        <li className="flex gap-2">
          <SocialIcon network="google" size="md" className="text-primary shrink-0 mt-0.5" />
          Google sign-up skips password — email/password uses verification OTP
        </li>
      </ul>
      <p className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
        If you see &quot;password found in a breach&quot;, choose a new unique password —
        this protects your account.
      </p>
    </aside>
  );
}
