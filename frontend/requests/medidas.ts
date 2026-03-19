export interface TypeFormCriarConta {
  email: string;
  senha: string;
  confirmarSenha: string;
}

const BASE_ROTA = "/medidas";

export const getMedidas = async () => {
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/ler-todas",
  );
  const dado = (await resposta.json()) as TypeMedida[];
  console.log({ dado });
  return dado;
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

/** Formato Firestore Timestamp ao serializar em JSON */
export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export interface TypeMedida {
  createdAt?: FirestoreTimestamp;
  idade: number;
  peso: number;
  altura: number;
  medidaBracoEsquerdo: number;
  medidaBracoDireito: number;
  medidaCoxaEsquerda: number;
  medidaCoxaDireita: number;
  medidaPanturrilhaEsquerda: number;
  medidaPanturrilhaDireita: number;
  medidaTorax: number;
  medidaQuadril: number;
}

export const postMedidaCriar = async (
  dados: TypeMedida,
  onSuccess: () => void,
  onError: () => void,
) => {
  console.log(dados);
  const dadosStringify = JSON.stringify(dados);
  console.log(dadosStringify);

  try {
    const resposta = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/criar",
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
