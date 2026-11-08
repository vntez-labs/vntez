import { PageHeaderSkeleton } from "@workspace/ui/components/skeleton";
import { ProductsGridSkeleton } from "@workspace/ui/components/layout-skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-16">
      <PageHeaderSkeleton />
      <ProductsGridSkeleton count={6} />
    </div>
  );
}
