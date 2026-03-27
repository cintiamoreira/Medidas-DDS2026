import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMedidaRemoverApi,
  getMedidaPorIdApi,
  getMedidasLerTodasApi,
  postMedidaCriarApi,
  putMedidaAtualizarApi,
} from "./api";

export const medidasLerTodasQueryKey = ["medidas", "ler-todas"] as const;

export function useMedidasLerTodas(opcoes: { enabled?: boolean }) {
  const { enabled = true } = opcoes;
  return useQuery({
    queryKey: medidasLerTodasQueryKey,
    queryFn: getMedidasLerTodasApi,
    enabled,
  });
}

export const medidaPorIdQueryKey = (id: string) =>
  ["medidas", "ler", id] as const;

export function useMedidaPorId(opcoes: {
  id: string | null;
  enabled?: boolean;
}) {
  const { id, enabled = true } = opcoes;
  return useQuery({
    queryKey: id ? medidaPorIdQueryKey(id) : ["medidas", "ler", "none"],
    queryFn: () => getMedidaPorIdApi(id!),
    enabled: Boolean(enabled && id && id.length > 0),
  });
}

export function usePostMedidaCriar() {
  return useMutation({
    mutationFn: postMedidaCriarApi,
  });
}

export function usePutMedidaAtualizar() {
  return useMutation({
    mutationFn: putMedidaAtualizarApi,
  });
}

export function useDeleteMedidaRemover() {
  return useMutation({
    mutationFn: deleteMedidaRemoverApi,
  });
}
