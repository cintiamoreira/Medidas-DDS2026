export interface TypeFormCriarConta {
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
  const dadosStringify = JSON.stringify(dados);
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
  usuario: string;
  senha: string;
}

export const postLogin = async (
  dados: TypeFormLogin,
  onSuccess: () => void,
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
    const dados = await resposta.json();
    console.log({ dados }); // salvar os dados em cookie para usar em varias paginas (ou outra solucao de state tipo zustand)
    onSuccess();
  } catch (erro) {
    onError();
  }
};
