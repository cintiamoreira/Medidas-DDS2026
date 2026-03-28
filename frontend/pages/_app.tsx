import type { AppProps } from "next/app";
import "../app/globals.css";
import { HealthTooltip } from "@/HealthProbe";
import { AppProviders } from "@/providers/AppProviders";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <HealthTooltip />
      <Component {...pageProps} />
    </AppProviders>
  );
}
