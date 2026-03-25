/** Campos do formulário de cadastro (confirmarSenha só no cliente). */
export interface TypeFormCriarConta {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const BASE_ROTA = "/usuarios";

/** Resposta de GET /usuarios/informacoes?id= */
export type TypeInformacoesUsuario = {
  email: string | null;
  nome: string | null;
};

/** Carrega nome e e-mail da conta no backend (Firebase Auth). */
export async function getUsuariosInformacoes(
  userId: string,
): Promise<TypeInformacoesUsuario> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/informacoes`,
  );
  url.searchParams.set("id", userId);
  const resposta = await fetch(url.toString());
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as informações da conta.");
  }
  return (await resposta.json()) as TypeInformacoesUsuario;
}

/** Corpo de PUT /usuarios/atualizar — alinhado a `schemaUsuarioAtualizar` no backend. */
export type TypeUsuarioAtualizar = {
  id: string;
  nome: string;
};

export async function putUsuarioAtualizar(
  dados: TypeUsuarioAtualizar,
): Promise<void> {
  const resposta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/atualizar`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dados),
    },
  );
  if (!resposta.ok) {
    throw new Error("Não foi possível atualizar o nome.");
  }
}

/** DELETE /usuarios/remover?id= — remove o usuário no Firebase Auth. */
export async function deleteUsuarioRemover(userId: string): Promise<void> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/remover`,
  );
  url.searchParams.set("id", userId);
  const resposta = await fetch(url.toString(), { method: "DELETE" });
  if (!resposta.ok) {
    throw new Error("Não foi possível excluir a conta.");
  }
}

export async function limparSessaoCookies(): Promise<void> {
  await fetch("/api/auth/sessao", {
    method: "DELETE",
    credentials: "same-origin",
  });
}

/** `userId` gravado no cookie httpOnly (via GET /api/auth/sessao). */
export async function getUserIdDaSessao(): Promise<string | null> {
  const resposta = await fetch("/api/auth/sessao", {
    credentials: "same-origin",
  });
  if (!resposta.ok) return null;
  const dados = (await resposta.json()) as { userId?: string | null };
  return typeof dados.userId === "string" && dados.userId.length > 0
    ? dados.userId
    : null;
}

export const postCriarConta = async (
  dados: TypeFormCriarConta,
  onSuccess: () => void,
  onError: () => void,
) => {
  console.log(dados);
  const corpo = {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
  };
  const dadosStringify = JSON.stringify(corpo);
  console.log(dadosStringify);
  try {
    const resposta = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/criar-conta",
      {
        method: "POST",
        body: dadosStringify,
        headers: {
          "content-type": "application/json",
        },
      },
    );
    if (!resposta.ok) {
      throw new Error();
    }
    onSuccess();
  } catch (e) {
    onError();
  }
};

export interface TypeFormLogin {
  email: string;
  senha: string;
}

/** Retorno do POST /usuarios/login — adequado para cookies httpOnly (via API route) ou storage conforme a política de segurança. */
export interface TypeLoginResposta {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  userId: string;
  email: string | null;
}

/** Indica se o cookie `id_token` está presente (verificado no servidor). */
export async function temSessaoCookie(): Promise<boolean> {
  const resposta = await fetch("/api/auth/sessao", {
    credentials: "same-origin",
  });
  return resposta.ok;
}

export const postLogin = async (
  dados: TypeFormLogin,
  onSuccess: (sessao: TypeLoginResposta) => void,
  onError: () => void,
) => {
  console.log(dados);
  const dadosStringify = JSON.stringify(dados);
  console.log(dadosStringify);

  try {
    const resposta = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/login",
      {
        method: "POST",
        body: dadosStringify,
        headers: {
          "content-type": "application/json",
        },
      },
    );
    if (!resposta.ok) {
      throw new Error();
    }
    const sessao = (await resposta.json()) as TypeLoginResposta;
    const okCookies = await fetch("/api/auth/sessao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessao),
      credentials: "same-origin",
    }).then((r) => r.ok);
    if (!okCookies) throw new Error();
    console.log({ sessao });
    onSuccess(sessao);
  } catch (erro) {
    onError();
  }
};
