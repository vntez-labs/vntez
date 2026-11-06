"use client";

import { ErrorBoundaryView } from "@workspace/ui/components/error-boundary-view";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundaryView
      error={error}
      reset={reset}
      appName="VNTEZ Console"
      homeHref="/"
    />
  );
}
