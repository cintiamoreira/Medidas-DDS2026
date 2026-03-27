import { useMutation } from "@tanstack/react-query";
import {
  deleteUsuariosRemover,
  postUsuariosCriarConta,
  postUsuariosLogin,
  putUsuariosAtualizar,
} from "./api";

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
