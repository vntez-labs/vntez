import { Skeleton, CardSkeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-24 pb-20 space-y-20">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-7 w-48 rounded-full" />
        <div className="space-y-3 w-full flex flex-col items-center">
          <Skeleton className="h-12 sm:h-16 w-4/5 rounded-2xl" />
          <Skeleton className="h-12 sm:h-16 w-3/5 rounded-2xl" />
        </div>
        <Skeleton className="h-5 w-full max-w-xl rounded-md" />
        <Skeleton className="h-5 w-4/5 max-w-lg rounded-md" />
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>

      {/* Grid Features Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
