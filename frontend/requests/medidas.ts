export interface TypeFormCriarConta {
  email: string;
  senha: string;
  confirmarSenha: string;
}

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
