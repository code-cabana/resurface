import { init, captureException } from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

export function sentryInit() {
  init({
    dsn: "https://5dcc5b13db974a6ba5c850d90a18c565@o1271690.ingest.sentry.io/6464314",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export function sentryError(error) {
  captureException(error);
}
