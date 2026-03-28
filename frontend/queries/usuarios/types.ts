/** Resposta de `GET /usuarios/ler?id=`. */
export type TypeInformacoesUsuario = {
  email: string | null;
  nome: string | null;
};

/** Corpo do formulário de login (campos do form). */
export type TypeFormLogin = {
  email: string;
  senha: string;
};

/** Resposta de `POST /usuarios/login` — usada para gravar cookies httpOnly via `/api/auth/sessao`. */
export type TypeLoginResposta = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  userId: string;
  email: string | null;
};

/** Formulário de cadastro (`confirmarSenha` só no cliente). */
export type TypeFormCriarConta = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

/** Corpo enviado a `POST /usuarios/criar-conta`. */
export type TypeCriarContaCorpoApi = {
  nome: string;
  email: string;
  senha: string;
};

/** Resposta de sucesso de `POST /usuarios/criar-conta`. */
export type TypeCriarContaResposta = {
  message: string;
};

/** Corpo de `PUT /usuarios/atualizar`. */
export type TypeUsuarioAtualizar = {
  id: string;
  nome: string;
};

/** Resposta de sucesso de `PUT /usuarios/atualizar`. */
export type TypeUsuarioAtualizarResposta = {
  id: string;
  message: string;
};

/** Resposta de sucesso de `DELETE /usuarios/remover`. */
export type TypeUsuarioRemoverResposta = {
  id: string;
  message: string;
};
