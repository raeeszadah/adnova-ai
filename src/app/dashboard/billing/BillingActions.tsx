"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BillingActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO", amount: 29.99 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      setMessage(data.message ?? "Plan upgraded successfully.");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <p className="text-sm text-primary bg-primary/10 border border-primary/30 rounded-xl px-4 py-3">
          {message}
        </p>
      )}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:scale-[1.02] transition-transform py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(209,255,0,0.2)] disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upgrade to PRO"}
      </button>
    </div>
  );
}
