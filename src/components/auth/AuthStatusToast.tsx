"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppIcon } from "@/components/icons";

const MESSAGES: Record<string, { type: "success" | "info"; text: string }> = {
  verified: {
    type: "success",
    text: "Email verified successfully. Welcome to AdNova AI!",
  },
  "signed-out": {
    type: "info",
    text: "You have been signed out.",
  },
};

export function AuthStatusToast() {
  const searchParams = useSearchParams();
  const authStatus = searchParams.get("auth");
  const [visible, setVisible] = useState(false);

  const message = authStatus ? MESSAGES[authStatus] : null;

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-[200] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-xl ${
        message.type === "success"
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-border bg-card/95 text-foreground"
      }`}
    >
      <AppIcon
        name={message.type === "success" ? "check_circle" : "info"}
        size="lg"
        className={
          message.type === "success" ? "text-primary" : "text-muted-foreground"
        }
      />
      <p className="text-sm font-medium">{message.text}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-auto rounded-full p-1 text-muted-foreground hover:bg-foreground/10"
        aria-label="Dismiss"
      >
        <AppIcon name="close" size="lg" />
      </button>
    </div>
  );
}
