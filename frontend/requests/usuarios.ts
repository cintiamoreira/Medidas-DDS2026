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
  /** TTL do idToken em segundos (string numérica, ex.: "3600"). */
  expiresIn: string;
  userId: string;
  email: string | null;
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
    console.log({ sessao });
    onSuccess(sessao);
  } catch (erro) {
    onError();
  }
};
