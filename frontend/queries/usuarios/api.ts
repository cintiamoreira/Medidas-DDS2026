import { getAuthorizationBearerHeaders } from "@/helpers/usuariosHelper";
import {
  MENSAGEM_ERRO_PADRAO,
  lerMensagemErroResposta,
} from "../../helpers/respostaErro";
import {
  lerCorpoJsonResposta,
  lerRespostaSucessoComIdEMensagem,
  lerRespostaSucessoComMensagem,
} from "../../helpers/respostaSucesso";
import type {
  TypeCriarContaCorpoApi,
  TypeCriarContaResposta,
  TypeFormCriarConta,
  TypeFormLogin,
  TypeInformacoesUsuario,
  TypeLoginResposta,
  TypeUsuarioAtualizar,
  TypeUsuarioAtualizarResposta,
  TypeUsuarioRemoverResposta,
} from "./types";

const BASE_ROTA = "/usuarios";

const MENSAGEM_ERRO_LOGIN = "Login falhou";
const MENSAGEM_ERRO_SESSAO_COOKIE = "Não foi possível gravar a sessão";
const MENSAGEM_ERRO_INFORMACOES_USUARIO =
  "Não foi possível carregar as informações da conta.";

/**
 * Autentica no backend e persiste a sessão em cookies httpOnly (`/api/auth/sessao`).
 */
export async function postUsuariosLogin(
  dados: TypeFormLogin,
): Promise<TypeLoginResposta> {
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/login`,
    {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_LOGIN),
    );
  }
  const corpoLogin = await lerCorpoJsonResposta(resposta);
  if (corpoLogin === null || typeof corpoLogin !== "object") {
    throw new Error(MENSAGEM_ERRO_LOGIN);
  }
  const sessao = corpoLogin as TypeLoginResposta;
  const okCookies = await fetch("/api/auth/sessao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessao),
    credentials: "same-origin",
  });
  if (!okCookies.ok) {
    throw new Error(
      await lerMensagemErroResposta(okCookies, MENSAGEM_ERRO_SESSAO_COOKIE),
    );
  }
  return sessao;
}

/**
 * Obtém e-mail e nome (Firebase Auth) via `GET /usuarios/informacoes?id=`.
 */
export async function getUsuariosInformacoes(
  userId: string,
): Promise<TypeInformacoesUsuario> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/informacoes`,
  );
  url.searchParams.set("id", userId);
  const resposta = await fetch(url.toString());
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(
        resposta,
        MENSAGEM_ERRO_INFORMACOES_USUARIO,
      ),
    );
  }
  const corpo = await lerCorpoJsonResposta(resposta);
  if (corpo === null || typeof corpo !== "object") {
    throw new Error(MENSAGEM_ERRO_INFORMACOES_USUARIO);
  }
  return corpo as TypeInformacoesUsuario;
}

const MENSAGEM_SUCESSO_CRIAR_CONTA = "Conta criada com sucesso.";
const MENSAGEM_SUCESSO_ATUALIZAR_USUARIO = "Usuário atualizado.";
const MENSAGEM_SUCESSO_REMOVER_USUARIO = "Usuário removido.";

/**
 * Cria conta no Firebase Auth via `POST /usuarios/criar-conta`.
 */
export async function postUsuariosCriarConta(
  dados: TypeFormCriarConta,
): Promise<TypeCriarContaResposta> {
  if (dados.senha !== dados.confirmarSenha) {
    throw new Error("As senhas não coincidem.");
  }
  const corpo: TypeCriarContaCorpoApi = {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
  };
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/criar-conta`,
    {
      method: "POST",
      body: JSON.stringify(corpo),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComMensagem(resposta, MENSAGEM_SUCESSO_CRIAR_CONTA);
}

/**
 * Atualiza nome (displayName) via `PUT /usuarios/atualizar`.
 */
export async function putUsuariosAtualizar(
  dados: TypeUsuarioAtualizar,
): Promise<TypeUsuarioAtualizarResposta> {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/atualizar`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        ...auth,
      },
      body: JSON.stringify(dados),
    },
  );
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComIdEMensagem(
    resposta,
    dados.id,
    MENSAGEM_SUCESSO_ATUALIZAR_USUARIO,
  );
}

/**
 * Remove a própria conta via `DELETE /usuarios/remover?id=`.
 */
export async function deleteUsuariosRemover(
  userId: string,
): Promise<TypeUsuarioRemoverResposta> {
  const auth = await getAuthorizationBearerHeaders();
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/remover`,
  );
  url.searchParams.set("id", userId);
  const resposta = await fetch(url.toString(), {
    method: "DELETE",
    headers: { ...auth },
  });
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_PADRAO),
    );
  }
  return lerRespostaSucessoComIdEMensagem(
    resposta,
    userId,
    MENSAGEM_SUCESSO_REMOVER_USUARIO,
  );
}
