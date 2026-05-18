import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/[0.06] shimmer-bg relative overflow-hidden",
        className
      )}
      aria-hidden
    />
  );
}

export function ShimmerBar({ className }: SkeletonProps) {
  return (
    <div className={cn("h-2 rounded-full bg-white/5 overflow-hidden", className)}>
      <div className="h-full w-full shimmer-bg rounded-full" />
    </div>
  );
}
