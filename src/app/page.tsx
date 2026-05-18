import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  LandingDemoButton,
} from "@/components/landing/LandingDemoContext";
import { LandingNavActions } from "@/components/landing/LandingNavActions";
import { LandingNavLinks } from "@/components/landing/LandingNavLinks";
import { LandingAuthToast } from "@/components/landing/LandingAuthToast";
import { AppIcon } from "@/components/icons";
import { BrandLogo } from "@/components/brand";
import { LandingPageShell } from "@/components/landing/LandingPageShell";

export default function Home() {
  return (
    <LandingPageShell>
      <Suspense fallback={null}>
        <LandingAuthToast />
      </Suspense>
      {/* TopNavBar */}
      <nav className="bg-background/80 backdrop-blur-xl flex justify-between items-center w-full px-8 h-20 sticky top-0 z-50 border-b border-white/5">
        <div className="flex min-w-0 shrink-0 items-center gap-12">
          <Link
            href="/"
            className="flex shrink-0 items-center hover:opacity-90 transition-opacity"
            aria-label="AdNova AI home"
          >
            <BrandLogo size="nav" priority />
          </Link>
          <LandingNavLinks />
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <LandingNavActions />
          <Show when="signed-out">
            <SignInButton mode="redirect" forceRedirectUrl="/auth/redirect">
              <button className="text-foreground px-6 py-2.5 rounded-full font-bold text-sm hover:bg-foreground/5 transition-all">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
              <button className="bg-primary text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 duration-200 transition-all shadow-[0_0_14px_rgba(209,255,0,0.22)]">
                Get Started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="bg-primary text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 duration-200 transition-all shadow-[0_0_14px_rgba(209,255,0,0.22)] inline-flex items-center">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>

      <main className="bg-[radial-gradient(circle_at_50%_-20%,rgba(0,74,198,0.15)_0%,rgba(247,249,251,0)_60%)]">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-8">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
              <AppIcon name="bolt" size="sm" active />
              Next-Gen Video Ads
            </div>
            <h1 className="font-headline text-7xl md:text-8xl font-extrabold text-foreground leading-[1.05] tracking-tight mb-8 max-w-5xl mx-auto">
              Scale Your Ad Creative with <span className="text-primary" style={{ textShadow: "0 0 15px rgba(0,74,198,0.2)" }}>AI Avatars</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
              Transform product images into high-converting talking avatar video ads in minutes. Professional production at the speed of thought.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Show when="signed-out">
                <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-extrabold text-lg hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,74,198,0.3)]">
                    Get Started Free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-extrabold text-lg hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,74,198,0.3)] inline-block">
                  Go to Dashboard
                </Link>
              </Show>
              <LandingDemoButton className="bg-foreground/5 backdrop-blur-xl border border-border text-foreground px-10 py-5 rounded-full font-bold text-lg hover:bg-foreground/10 transition-all flex items-center gap-2">
                <AppIcon name="play_circle" size="md" />
                View Demo
              </LandingDemoButton>
            </div>
          </div>

          <div className="max-w-6xl mx-auto relative group">
            {/* Main Video Visual */}
            <div className="aspect-video bg-foreground/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-border">
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
              <div className="absolute bottom-8 left-8 bg-white/5 backdrop-blur-xl p-6 rounded-2xl max-w-sm border-l-4 border-primary shadow-lg">
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
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-center text-muted-foreground font-sans text-xs uppercase tracking-[0.3em] mb-12 font-bold">Trusted by global platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-700">
              <div className="flex items-center gap-2 font-headline font-bold text-2xl text-foreground">
                <AppIcon name="shopping_bag" size="md" className="text-primary" /> Shopify
              </div>
              <div className="flex items-center gap-2 font-headline font-bold text-2xl text-foreground">
                <AppIcon name="package_2" size="md" className="text-primary" /> Amazon
              </div>
              <div className="flex items-center gap-2 font-headline font-bold text-2xl text-foreground">
                <AppIcon name="storefront" size="md" className="text-primary" /> Etsy
              </div>
              <div className="flex items-center gap-2 font-headline font-bold text-2xl text-foreground">
                <AppIcon name="shopping_cart" size="md" className="text-primary" /> Walmart
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-headline text-5xl font-extrabold text-foreground mb-6">Built for Conversion</h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Our engine combines the best AI technologies to deliver studio-quality ads at scale.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-foreground/5 backdrop-blur-xl p-12 rounded-[2.5rem] hover:bg-foreground/10 hover:border-primary/30 transition-all duration-500 group border border-border">
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
              <div className="bg-foreground/5 backdrop-blur-xl p-12 rounded-[2.5rem] hover:bg-foreground/10 hover:border-accent/30 transition-all duration-500 group border border-border">
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
              <div className="bg-foreground/5 backdrop-blur-xl p-12 rounded-[2.5rem] hover:bg-foreground/10 hover:border-primary/30 transition-all duration-500 group border border-border">
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
        <section className="py-32 px-8">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-foreground/5 backdrop-blur-xl p-20 text-center relative overflow-hidden border border-primary/20 shadow-lg">
            <div className="absolute inset-0 bg-primary/5 -z-10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full"></div>
            <h2 className="font-headline text-6xl font-extrabold mb-8 text-foreground">Ready to boost your sales?</h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of ecommerce brands generating high-performance video ads with AdNova AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Show when="signed-out">
                <SignUpButton mode="redirect" forceRedirectUrl="/auth/redirect">
                  <button className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-extrabold text-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,74,198,0.3)] active:scale-95">
                    Create Your First Video
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-extrabold text-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,74,198,0.3)] active:scale-95 inline-flex items-center justify-center">
                  Create Your First Video
                </Link>
              </Show>
              <button className="bg-foreground/5 backdrop-blur-xl border border-border text-foreground px-12 py-5 rounded-full font-bold text-xl hover:bg-foreground/10 transition-all">
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
