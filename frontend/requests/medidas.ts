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
