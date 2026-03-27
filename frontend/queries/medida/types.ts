import type { TypePostFormMedida } from "@/requests/medidas";

/** Resposta de sucesso de `POST /medidas/criar`. */
export type TypeMedidaCriarResposta = {
  id: string;
  message: string;
};

/** Resposta de sucesso de `PUT /medidas/atualizar`. */
export type TypeMedidaAtualizarResposta = TypeMedidaCriarResposta;

/** Variáveis da mutação de atualização. */
export type TypeMedidaAtualizarVariaveis = {
  id: string;
  dados: TypePostFormMedida;
};

/** Resposta de sucesso de `DELETE /medidas/remover`. */
export type TypeMedidaRemoverResposta = TypeMedidaCriarResposta;
