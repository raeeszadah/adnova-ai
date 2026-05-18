import { Skeleton } from "@/components/ui/skeleton";

export function VideoThumbnailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-black/30 ${className ?? ""}`}
      aria-label="Loading video"
    >
      <div className="absolute inset-0 shimmer-bg-subtle opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    </div>
  );
}

export function VideoPreviewSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-black/40 p-4 ${className ?? ""}`}
    >
      <Skeleton className="w-full max-w-[200px] aspect-video rounded-lg" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
