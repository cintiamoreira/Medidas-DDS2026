import { getAuthorizationBearerHeaders } from "@/helpers/usuariosHelper";
import {
  MENSAGEM_ERRO_PADRAO,
  lerMensagemErroResposta,
} from "@/helpers/respostaErro";
import {
  lerCorpoJsonResposta,
  lerRespostaSucessoComIdEMensagem,
} from "@/helpers/respostaSucesso";
import type {
  TypeMedida,
  TypeMedidaLista,
  TypePostFormMedida,
} from "@/requests/medidas";
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
 * Lista medidas do utilizador via `GET /medidas/ler-todas` (Bearer obrigatório).
 */
export async function getMedidasLerTodasApi(): Promise<TypeMedidaLista[]> {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/ler-todas`,
    { headers: { ...auth } },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  const corpo = await lerCorpoJsonResposta(resposta);
  if (corpo === null) {
    throw new Error(MENSAGEM_ERRO_PADRAO);
  }
  return corpo as TypeMedidaLista[];
}

/**
 * Obtém uma medida via `GET /medidas/ler?id=…` (Bearer obrigatório).
 */
export async function getMedidaPorIdApi(id: string): Promise<TypeMedida> {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/ler?id=${encodeURIComponent(id)}`,
    { headers: { ...auth } },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  const corpo = await lerCorpoJsonResposta(resposta);
  if (corpo === null) {
    throw new Error(MENSAGEM_ERRO_PADRAO);
  }
  return corpo as TypeMedida;
}

/**
 * Remove medida via `DELETE /medidas/remover?id=…` (Bearer obrigatório).
 */
export async function deleteMedidaRemoverApi(
  id: string,
): Promise<TypeMedidaRemoverResposta> {
  const auth = await getAuthorizationBearerHeaders();
  const params = new URLSearchParams({ id });
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/remover?${params.toString()}`,
    { method: "DELETE", headers: { ...auth } },
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
