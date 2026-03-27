import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

function criarQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Envolve a app com o TanStack Query. Um `QueryClient` por montagem evita
 * estado partilhado entre pedidos em SSR.
 *
 * (Devtools: `npm i -D @tanstack/react-query-devtools` e um import dinâmico
 * só em desenvolvimento, se quiseres o painel.)
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(criarQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
