import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { AppIcon } from "@/components/icons";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  AI_TECHNOLOGIES,
  FOOTER_NAV,
  FOOTER_SOCIAL,
  FOOTER_VERSION,
  PROJECT_GUIDE,
  TEAM_NOVA_MINDS,
} from "@/lib/footer-config";

type SocialKey = keyof typeof FOOTER_SOCIAL;

const SOCIAL_LINKS: { key: SocialKey; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "youtube", label: "YouTube" },
  { key: "twitter", label: "X (Twitter)" },
  { key: "facebook", label: "Facebook" },
];

function SocialLink({ href, label, network }: { href: string; label: string; network: SocialKey }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social group relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-foreground/[0.04] backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(209,255,0,0.2)] hover:-translate-y-0.5"
    >
      <SocialIcon
        network={network}
        size="lg"
        className="text-muted-foreground transition-colors duration-300 group-hover:text-primary"
      />
    </a>
  );
}

export function SiteFooter() {
  const activeSocials = SOCIAL_LINKS.filter(
    ({ key }) => FOOTER_SOCIAL[key]?.trim().length > 0
  );

  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-border bg-background transition-colors duration-300">
      <div className="footer-glow-primary pointer-events-none absolute inset-0" />
      <div className="footer-glow-secondary pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="group inline-flex flex-col gap-2 transition-opacity hover:opacity-90"
              aria-label="AdNova AI home"
            >
              <BrandLogo size="xl" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                Team NovaMinds
              </p>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The cinematic canvas for advertisers — transform product images into
              high-converting AI avatar video ads in minutes.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Built with Generative AI
              </span>
              <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                v{FOOTER_VERSION}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              About AdNova AI
            </h3>
            <div className="footer-glass rounded-2xl border border-border p-4 space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                AdNova AI is a final-year academic SaaS platform for automated
                product video advertisements using AI avatars, script generation,
                and cinematic composition.
              </p>
              <p className="text-xs font-semibold text-primary">
                Developed by Team NovaMinds
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Quick Links
            </h3>
            <nav className="footer-glass rounded-2xl border border-border p-4">
              <ul className="space-y-2">
                {FOOTER_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-1"
                    >
                      <AppIcon
                        name="chevron_right"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-primary"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Team NovaMinds
            </h3>
            <div className="footer-glass rounded-2xl border border-border p-4 space-y-4">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEAM_NOVA_MINDS.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {name}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Project Guide
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {PROJECT_GUIDE.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PROJECT_GUIDE.department}
                  <br />
                  {PROJECT_GUIDE.university}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="footer-glass rounded-2xl border border-border p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Connect With Us
            </h3>
            {activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map(({ key, label }) => (
                  <SocialLink
                    key={key}
                    href={FOOTER_SOCIAL[key]}
                    label={label}
                    network={key}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Social links coming soon.
              </p>
            )}
          </div>

          <div className="footer-glass rounded-2xl border border-border p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Powered by AI Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {AI_TECHNOLOGIES.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-border bg-foreground/[0.03] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            © 2026 AdNova AI | Designed &amp; Developed by Team NovaMinds, MIT ADT
            University.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
            <span className="rounded-lg border border-border bg-foreground/[0.04] px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-sm">
              v{FOOTER_VERSION}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
