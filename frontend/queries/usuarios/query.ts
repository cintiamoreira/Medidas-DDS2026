import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteUsuariosRemover,
  getUsuariosInformacoes,
  postUsuariosCriarConta,
  postUsuariosLogin,
  putUsuariosAtualizar,
} from "./api";

export const usuariosInformacoesQueryKey = (userId: string) =>
  ["usuarios", "informacoes", userId] as const;

export function useUsuarioInformacoes(userId: string | null) {
  return useQuery({
    queryKey: userId
      ? usuariosInformacoesQueryKey(userId)
      : ["usuarios", "informacoes", "none"],
    queryFn: () => getUsuariosInformacoes(userId!),
    enabled: userId !== null && userId.length > 0,
  });
}

export function usePostUsuarioLogin() {
  return useMutation({
    mutationFn: postUsuariosLogin,
  });
}

export function usePostUsuarioCriarConta() {
  return useMutation({
    mutationFn: postUsuariosCriarConta,
  });
}

export function usePutUsuarioAtualizar() {
  return useMutation({
    mutationFn: putUsuariosAtualizar,
  });
}

export function useDeleteUsuarioRemover() {
  return useMutation({
    mutationFn: deleteUsuariosRemover,
  });
}
