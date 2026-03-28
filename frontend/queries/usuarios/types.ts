export type TypeInformacoesUsuario = {
  email: string | null;
  nome: string | null;
};

export type TypeFormLogin = {
  email: string;
  senha: string;
};

export type TypeLoginResposta = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  userId: string;
  email: string | null;
};

export type TypeFormCriarConta = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export type TypeCriarContaCorpoApi = {
  nome: string;
  email: string;
  senha: string;
};

export type TypeCriarContaResposta = {
  message: string;
};

export type TypeUsuarioAtualizar = {
  id: string;
  nome: string;
};

export type TypeUsuarioAtualizarResposta = {
  id: string;
  message: string;
};

export type TypeUsuarioRemoverResposta = {
  id: string;
  message: string;
};
