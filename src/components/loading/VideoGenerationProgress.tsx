"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

export type GenerationPhase =
  | "script"
  | "avatar"
  | "heygen"
  | "compose"
  | "finalize";

type StepState = "pending" | "active" | "done";

type Step = {
  id: GenerationPhase;
  label: string;
  description: string;
  icon: IconName;
};

const STEPS: Step[] = [
  {
    id: "script",
    label: "AI script",
    description: "Crafting your ad copy",
    icon: "auto_awesome",
  },
  {
    id: "avatar",
    label: "Avatar setup",
    description: "Sending job to HeyGen",
    icon: "face",
  },
  {
    id: "heygen",
    label: "Avatar render",
    description: "HeyGen is generating video",
    icon: "smart_display",
  },
  {
    id: "compose",
    label: "Final compose",
    description: "Blending product + avatar (Remotion)",
    icon: "movie_edit",
  },
  {
    id: "finalize",
    label: "Upload & finish",
    description: "Saving to your library",
    icon: "cloud_upload",
  },
];

function phaseToStepState(
  stepId: GenerationPhase,
  current: GenerationPhase
): StepState {
  const order = STEPS.map((s) => s.id);
  const ci = order.indexOf(current);
  const si = order.indexOf(stepId);
  if (si < ci) return "done";
  if (si === ci) return "active";
  return "pending";
}

type VideoGenerationProgressProps = {
  phase: GenerationPhase;
  progress: number;
  statusMessage?: string;
  className?: string;
};

export function VideoGenerationProgress({
  phase,
  progress,
  statusMessage,
  className,
}: VideoGenerationProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const [displayProgress, setDisplayProgress] = useState(clampedProgress);

  useEffect(() => {
    const t = setTimeout(() => setDisplayProgress(clampedProgress), 50);
    return () => clearTimeout(t);
  }, [clampedProgress]);

  const activeStep = useMemo(
    () => STEPS.find((s) => phaseToStepState(s.id, phase) === "active"),
    [phase]
  );

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto space-y-8 py-4",
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center ai-pulse-ring">
            <AppIcon name="neurology" size="2xl" className="text-primary" active />
          </div>
          <span className="absolute -inset-1 rounded-2xl border border-primary/20 animate-ping opacity-20" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">AI is creating your ad</h2>
          <p className="text-sm text-muted-foreground">
            {statusMessage ?? activeStep?.description ?? "Processing…"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Progress</span>
          <span className="text-primary tabular-nums">
            {Math.round(displayProgress)}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/5 border border-border overflow-hidden progress-shimmer">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/80 via-primary to-secondary/80 transition-[width] duration-700 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3" aria-label="Generation steps">
        {STEPS.map((step) => {
          const state = phaseToStepState(step.id, phase);
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl border transition-all duration-500",
                state === "active" &&
                  "bg-primary/5 border-primary/40 step-active",
                state === "done" &&
                  "bg-white/[0.02] border-border opacity-80",
                state === "pending" &&
                  "bg-transparent border-border/50 opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  state === "active" && "bg-primary/20 text-primary",
                  state === "done" && "bg-primary/10 text-primary",
                  state === "pending" && "bg-white/5 text-muted-foreground"
                )}
              >
                {state === "done" ? (
                  <AppIcon name="check_circle" size="lg" active />
                ) : (
                  <AppIcon
                    name={step.icon}
                    size="lg"
                    active={state === "active"}
                    className={state === "active" ? "animate-pulse" : undefined}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p
                  className={cn(
                    "text-sm font-bold",
                    state === "active" && "text-primary"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>
              {state === "active" && (
                <span className="flex gap-1 shrink-0">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-center text-xs text-muted-foreground">
        You can leave this page — check My Videos when complete.
      </p>
    </div>
  );
}
