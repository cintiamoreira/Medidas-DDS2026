import { useQuery } from "@tanstack/react-query";
import { getHealthApi } from "./api";

export const healthQueryKey = ["sistema", "health"] as const;

/**
 * Verificação de saúde do backend; pensado para correr uma vez por sessão
 * (sem refetch em foco/montagem após sucesso).
 */
export function useHealth(opcoes: { enabled?: boolean } = {}) {
  const { enabled = true } = opcoes;
  return useQuery({
    queryKey: healthQueryKey,
    queryFn: getHealthApi,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
}
