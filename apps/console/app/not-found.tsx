import { NotFoundView } from "@workspace/ui/components/not-found-view";

export default function NotFound() {
  return (
    <NotFoundView
      appName="VNTEZ Console"
      homeHref="/"
      docsHref="https://vntez.cloud/docs"
      consoleHref="/"
      idHref="https://id.vntez.cloud"
    />
  );
}
