import type { TypePostFormMedida } from "@/requests/medidas";

export type TypeMedidaCriarResposta = {
  id: string;
  message: string;
};

export type TypeMedidaAtualizarResposta = TypeMedidaCriarResposta;

export type TypeMedidaAtualizarVariaveis = {
  id: string;
  dados: TypePostFormMedida;
};

export type TypeMedidaRemoverResposta = TypeMedidaCriarResposta;
