import { useMutation } from "@tanstack/react-query";
import {
  deleteMedidaRemoverApi,
  postMedidaCriarApi,
  putMedidaAtualizarApi,
} from "./api";

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
