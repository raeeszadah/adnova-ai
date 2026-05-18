import { Skeleton } from "@/components/ui/skeleton";

export function BillingPageSkeleton() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-8 space-y-4"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
