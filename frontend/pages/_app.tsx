import type { AppProps } from "next/app";
import "../app/globals.css";
import { AppProviders } from "@/providers/AppProviders";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
