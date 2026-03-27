import { getAuthorizationBearerHeaders } from "@/helpers/usuariosHelper";
import {
  MENSAGEM_ERRO_PADRAO,
  lerMensagemErroResposta,
} from "@/helpers/respostaErro";
import { lerRespostaSucessoComIdEMensagem } from "@/helpers/respostaSucesso";
import type { TypePostFormMedida } from "@/requests/medidas";
import type {
  TypeMedidaAtualizarResposta,
  TypeMedidaAtualizarVariaveis,
  TypeMedidaCriarResposta,
  TypeMedidaRemoverResposta,
} from "./types";

const BASE_ROTA = "/medidas";
const MENSAGEM_SUCESSO_CRIAR_MEDIDA = "Medida criada.";
const MENSAGEM_SUCESSO_ATUALIZAR_MEDIDA = "Medida atualizada.";
const MENSAGEM_SUCESSO_REMOVER_MEDIDA = "Medida removida.";

/**
 * Cria medida no Firestore via `POST /medidas/criar` (Bearer obrigatório).
 */
export async function postMedidaCriarApi(
  dados: TypePostFormMedida,
): Promise<TypeMedidaCriarResposta> {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/criar`,
    {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {
        "content-type": "application/json",
        ...auth,
      },
    },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComIdEMensagem(
    resposta,
    "",
    MENSAGEM_SUCESSO_CRIAR_MEDIDA,
  );
}

/**
 * Atualiza medida via `PUT /medidas/atualizar` (Bearer obrigatório).
 */
export async function putMedidaAtualizarApi(
  variaveis: TypeMedidaAtualizarVariaveis,
): Promise<TypeMedidaAtualizarResposta> {
  const { id, dados } = variaveis;
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/atualizar`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        ...auth,
      },
      body: JSON.stringify({ id, ...dados }),
    },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComIdEMensagem(
    resposta,
    id,
    MENSAGEM_SUCESSO_ATUALIZAR_MEDIDA,
  );
}

/**
 * Remove medida via `DELETE /medidas/remover?id=…` (mesmo contrato do backend atual).
 */
export async function deleteMedidaRemoverApi(
  id: string,
): Promise<TypeMedidaRemoverResposta> {
  const params = new URLSearchParams({ id });
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/remover?${params.toString()}`,
    { method: "DELETE" },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComIdEMensagem(
    resposta,
    id,
    MENSAGEM_SUCESSO_REMOVER_MEDIDA,
  );
}
