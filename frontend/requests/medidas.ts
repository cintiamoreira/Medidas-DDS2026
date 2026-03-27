import { getAuthorizationBearerHeaders } from "@/helpers/usuariosHelper";

export interface TypeFormCriarConta {
  email: string;
  senha: string;
  confirmarSenha: string;
}

const BASE_ROTA = "/medidas";

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
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/ler-todas",
    { headers: { ...auth } },
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
    const auth = await getAuthorizationBearerHeaders();
    const resposta = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/criar",
      {
        method: "POST",
        body: dadosStringify,
        headers: {
          "content-type": "application/json",
          ...auth,
        },
      },
    );
    if (!resposta.ok) {
      throw new Error();
    }
    const dados = await resposta.json();
    console.log({ dados });
    onSuccess();
  } catch (erro) {
    onError();
  }
};

export const getMedidaPorId = async (id: string) => {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/ler?id=" + id,
    { headers: { ...auth } },
  );
  const dado = (await resposta.json()) as TypeMedida;
  console.log({ dado });
  return dado;
};

export const putMedidaAtualizar = async (
  id: string,
  dados: TypePostFormMedida,
) => {
  const auth = await getAuthorizationBearerHeaders();
  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/atualizar",
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
    throw new Error("Erro ao atualizar medida");
  }
  const dado = (await resposta.json()) as { id: string; message: string };
  return dado;
};

export const deleteMedidaRemover = async (
  id: string,
): Promise<{ id: string; message: string } | null> => {
  const digitado = window.prompt(
    "Para confirmar a exclusão, digite o ID da medida:",
  );
  if (digitado === null || digitado.trim() !== id) return null;

  const resposta = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + BASE_ROTA + "/remover?id=" + id,
    { method: "DELETE" },
  );
  if (!resposta.ok) {
    throw new Error("Erro ao remover medida");
  }
  const dado = (await resposta.json()) as { id: string; message: string };
  return dado;
};
