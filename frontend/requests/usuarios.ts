/** Campos do formulário de cadastro (confirmarSenha só no cliente). */
export interface TypeFormCriarConta {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const BASE_ROTA = "/usuarios";

export const getUsuariosInformacoes = async () => {
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/informacoes",
  );
  const dado = await resposta.json();
  console.log({ dado });
};

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
