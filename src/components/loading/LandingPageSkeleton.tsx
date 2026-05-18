import { Skeleton } from "@/components/ui/skeleton";

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-20 border-b border-border px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-7 w-28" />
          </div>
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <main className="flex-1 px-8 pt-16 pb-24">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
          <Skeleton className="h-16 w-full max-w-3xl mx-auto" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-14 w-44 rounded-full" />
            <Skeleton className="h-14 w-36 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-16 max-w-6xl mx-auto aspect-video rounded-[2.5rem] w-full" />
      </main>

      <footer className="border-t border-border px-6 py-12 space-y-6">
        <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-4 w-full max-w-xl mx-auto" />
      </footer>
    </div>
  );
}
