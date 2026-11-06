import { NotFoundView } from "@workspace/ui/components/not-found-view";

export default function NotFound() {
  return (
    <NotFoundView
      appName="VNTEZ Web"
      homeHref="/"
      docsHref="/docs"
      consoleHref="https://console.vntez.cloud"
      idHref="https://iam.vntez.cloud"
    />
  );
}
