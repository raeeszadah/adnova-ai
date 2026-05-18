import { AppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type ProcessingVideoCardProps = {
  status: string;
  className?: string;
};

export function ProcessingVideoPlaceholder({
  status,
  className,
}: ProcessingVideoCardProps) {
  const isFailed = status === "FAILED";

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 shimmer-bg-subtle opacity-40" />
      {!isFailed && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
          <div className="h-full w-1/3 bg-primary/60 rounded-full shimmer-bg" />
        </div>
      )}
      <AppIcon
        name={isFailed ? "error" : "smart_display"}
        size="2xl"
        className={cn("relative z-10", isFailed ? "text-red-400" : "text-primary")}
      />
      <span className="text-xs text-muted-foreground relative z-10 max-w-[140px]">
        {isFailed
          ? "Generation failed"
          : status === "COMPLETED"
            ? "File missing"
            : status.replace(/_/g, " ")}
      </span>
      {!isFailed && status !== "COMPLETED" && (
        <span className="text-[10px] uppercase tracking-wider text-primary/80 font-bold relative z-10">
          AI processing
        </span>
      )}
    </div>
  );
}
