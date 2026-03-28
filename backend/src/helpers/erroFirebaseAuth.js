/**
 * Converte erros do Firebase Admin Auth (createUser, etc.) em HTTP status + mensagem segura para o cliente.
 * @param {unknown} erro
 * @returns {{ status: number, message: string } | null}
 */
export function mapearErroFirebaseAuthParaCliente(erro) {
  if (!erro || typeof erro !== 'object') {
    return null;
  }
  const code = /** @type {{ code?: string }} */ (erro).code;
  if (typeof code !== 'string') {
    return null;
  }

  const mapa = {
    'auth/email-already-exists': {
      status: 409,
      message:
        'Este e-mail já está registado. Inicie sessão ou utilize outro e-mail.',
    },
    'auth/invalid-email': {
      status: 400,
      message: 'O e-mail indicado não é válido.',
    },
    'auth/invalid-password': {
      status: 400,
      message:
        'A senha não cumpre os requisitos (por exemplo, mínimo de 6 caracteres).',
    },
    'auth/weak-password': {
      status: 400,
      message: 'A senha é demasiado fraca. Utilize uma combinação mais forte.',
    },
    'auth/operation-not-allowed': {
      status: 403,
      message: 'O registo de novas contas não está autorizado neste momento.',
    },
    'auth/uid-already-exists': {
      status: 409,
      message: 'Não foi possível concluir o registo. Tente novamente.',
    },
  };

  return mapa[code] ?? null;
}
