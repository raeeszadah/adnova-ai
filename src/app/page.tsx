import { Suspense } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LandingDemoButton } from "@/components/landing/LandingDemoContext";
import { LandingAuthToast } from "@/components/landing/LandingAuthToast";
import { LandingTopNav } from "@/components/landing/LandingTopNav";
import { AppIcon } from "@/components/icons";
import { LandingPageShell } from "@/components/landing/LandingPageShell";
import { Show, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <LandingPageShell>
      <Suspense fallback={null}>
        <LandingAuthToast />
      </Suspense>
      <LandingTopNav />

      <main className="overflow-x-hidden bg-[radial-gradient(circle_at_50%_-20%,rgba(0,74,198,0.15)_0%,rgba(247,249,251,0)_60%)]">
        {/* Hero Section */}
        <section className="relative px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
              <AppIcon name="bolt" size="sm" active />
              Next-Gen Video Ads
            </div>
            <h1 className="mx-auto mb-6 max-w-5xl font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Scale Your Ad Creative with <span className="text-primary" style={{ textShadow: "0 0 15px rgba(0,74,198,0.2)" }}>AI Avatars</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mb-12 sm:text-lg lg:text-xl">
              Transform product images into high-converting talking avatar video ads in minutes. Professional production at the speed of thought.
            </p>
            <div className="mx-auto flex w-full max-w-lg flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-6">
              <Show when="signed-out">
                <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-extrabold text-base hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,74,198,0.3)] sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
                    Get Started Free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-extrabold text-base hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,74,198,0.3)] inline-flex items-center justify-center sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
                  Go to Dashboard
                </Link>
              </Show>
              <LandingDemoButton className="w-full bg-foreground/5 backdrop-blur-xl border border-border text-foreground px-8 py-4 rounded-full font-bold text-base hover:bg-foreground/10 transition-all flex items-center justify-center gap-2 sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
                <AppIcon name="play_circle" size="md" />
                View Demo
              </LandingDemoButton>
            </div>
          </div>

          <div className="relative mx-auto max-w-6xl min-w-0 group">
            {/* Main Video Visual */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-foreground/5 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem]">
              <img alt="AI Avatar Interface" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxpsa34RwbG66jnFDDuohW2B33hphKtaKHVHHRZbFJWlhjhL7Yowo9monVOyn137fB82Yc1hLjesMs22Q2ePMNqESxxhfs079XCn2qyO3rzpbT4kbV4S8Pgxux1gFxRhV45iwENMGn7BV7OKYHFDbLSN3afdfq3EbYx7r3PnbAQoegIoNlvaP5pjFIhScGcj6k2l7TCuv3zd9L17UpFmS5HEBlD-JoaqMfdAfUWkWPdurOLydcgmpPpysIVyld4cChSd1Y_QrIfg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LandingDemoButton
                  className="w-24 h-24 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,74,198,0.3)]"
                  aria-label="Play product demo"
                >
                  <AppIcon name="play_arrow" size="2xl" className="text-primary-foreground" active />
                </LandingDemoButton>
              </div>
              
              {/* Floating Glass Card */}
              <div className="absolute bottom-4 left-4 hidden max-w-[calc(100%-2rem)] rounded-2xl border-l-4 border-primary bg-white/5 p-4 shadow-lg backdrop-blur-xl sm:bottom-8 sm:left-8 sm:block sm:max-w-sm sm:p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-slate-800"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-slate-700"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-slate-600"></div>
                  </div>
                  <div className="text-foreground text-sm font-bold">10k+ active users</div>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Join the elite ecommerce brands scaling with AI-driven creativity.</p>
              </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/20 blur-[120px] rounded-full -z-10"></div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 border-y border-border bg-foreground/[0.02]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground font-sans text-xs uppercase tracking-[0.3em] mb-12 font-bold">Trusted by global platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-16 lg:gap-24 opacity-40 transition-opacity duration-700 hover:opacity-100">
              <div className="flex items-center gap-2 font-headline text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                <AppIcon name="shopping_bag" size="md" className="shrink-0 text-primary" /> Shopify
              </div>
              <div className="flex items-center gap-2 font-headline text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                <AppIcon name="package_2" size="md" className="shrink-0 text-primary" /> Amazon
              </div>
              <div className="flex items-center gap-2 font-headline text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                <AppIcon name="storefront" size="md" className="shrink-0 text-primary" /> Etsy
              </div>
              <div className="flex items-center gap-2 font-headline text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                <AppIcon name="shopping_cart" size="md" className="shrink-0 text-primary" /> Walmart
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center sm:mb-16 lg:mb-24">
              <h2 className="mb-4 font-headline text-3xl font-extrabold text-foreground sm:mb-6 sm:text-4xl lg:text-5xl">Built for Conversion</h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">Our engine combines the best AI technologies to deliver studio-quality ads at scale.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {/* Feature 1 */}
              <div className="group rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-foreground/10 sm:rounded-[2.5rem] sm:p-8 lg:p-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:shadow-[0_0_20px_rgba(0,74,198,0.3)] transition-all">
                  <AppIcon name="auto_awesome" size="2xl" active />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-6">Instant Scripting</h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  Powered by Gemini, our AI analyzes your product benefits and generates persuasive, high-converting ad scripts optimized for social engagement.
                </p>
                <div className="flex items-center text-primary font-bold text-sm tracking-widest uppercase">
                  Learn more <AppIcon name="arrow_forward" size="sm" className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="group rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/30 hover:bg-foreground/10 sm:rounded-[2.5rem] sm:p-8 lg:p-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-accent mb-10 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all">
                  <AppIcon name="face" size="2xl" active />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-6">Hyper-Realistic Avatars</h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  Utilizing HeyGen technology to bring scripts to life with perfect lip-syncing and human-like gestures that build trust instantly.
                </p>
                <div className="flex items-center text-accent font-bold text-sm tracking-widest uppercase">
                  Learn more <AppIcon name="arrow_forward" size="sm" className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="group rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:bg-foreground/10 sm:rounded-[2.5rem] sm:p-8 lg:p-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:shadow-[0_0_20px_rgba(0,74,198,0.3)] transition-all">
                  <AppIcon name="rocket_launch" size="2xl" active />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground mb-6">One-Click Export</h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  Export directly to Meta Ads Manager, TikTok, or Shopify with perfectly formatted aspect ratios and captions included.
                </p>
                <div className="flex items-center text-primary font-bold text-sm tracking-widest uppercase">
                  Learn more <AppIcon name="arrow_forward" size="sm" className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-foreground/5 p-8 text-center shadow-lg backdrop-blur-xl sm:rounded-[2.5rem] sm:p-12 lg:rounded-[3rem] lg:p-20">
            <div className="absolute inset-0 bg-primary/5 -z-10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full"></div>
            <h2 className="mb-6 font-headline text-3xl font-extrabold text-foreground sm:mb-8 sm:text-4xl lg:text-6xl">Ready to boost your sales?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:mb-12 sm:text-lg lg:text-xl">
              Join thousands of ecommerce brands generating high-performance video ads with AdNova AI.
            </p>
            <div className="mx-auto flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
              <Show when="signed-out">
                <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-extrabold text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,74,198,0.3)] active:scale-95 sm:w-auto sm:px-12 sm:py-5 sm:text-xl">
                    Create Your First Video
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-extrabold text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,74,198,0.3)] active:scale-95 inline-flex items-center justify-center sm:w-auto sm:px-12 sm:py-5 sm:text-xl">
                  Create Your First Video
                </Link>
              </Show>
              <button type="button" className="w-full bg-foreground/5 backdrop-blur-xl border border-border text-foreground px-8 py-4 rounded-full font-bold text-base hover:bg-foreground/10 transition-all sm:w-auto sm:px-12 sm:py-5 sm:text-xl">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </LandingPageShell>
  );
}
