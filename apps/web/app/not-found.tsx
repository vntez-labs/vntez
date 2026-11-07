import { NotFoundView } from "@workspace/ui/components/not-found-view";

const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app";

export default function NotFound() {
  return (
    <NotFoundView
      appName="VNTEZ Web"
      homeHref="/"
      docsHref={DOCS_URL}
      consoleHref="https://console.vntez.cloud"
      idHref="https://iam.vntez.cloud"
    />
  );
}
