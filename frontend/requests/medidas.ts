export interface TypeFormCriarConta {
  email: string;
  senha: string;
  confirmarSenha: string;
}

const BASE_ROTA = "/medidas";

/** Formato Firestore Timestamp ao serializar em JSON */
export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export interface TypeMedidaLista {
  id?: string;
  createdAt?: FirestoreTimestamp;
  peso: number;
  idade: number;
}

export interface TypePostFormMedida {
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

export type TypeMedida = TypeMedidaLista & TypePostFormMedida;

export const getMedidas = async () => {
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/ler-todas",
  );
  const dado = (await resposta.json()) as TypePostFormMedida[];
  console.log({ dado });
  return dado;
};

export const postMedidaCriar = async (
  dados: TypePostFormMedida,
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

export const getMedidaPorId = async (id: string) => {
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/ler?id=" + id,
  );
  const dado = (await resposta.json()) as TypeMedida;
  console.log({ dado });
  return dado;
};
