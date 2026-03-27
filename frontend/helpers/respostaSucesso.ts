/**
 * Lê o JSON de uma `Response` já com status ok; devolve `null` se o parse falhar.
 */
export async function lerCorpoJsonResposta(
  resposta: Response,
): Promise<unknown | null> {
  try {
    return await resposta.json();
  } catch {
    return null;
  }
}

/**
 * Extrai `message` de um corpo JSON; usa `mensagemFallback` se faltar ou vier vazio.
 */
export function extrairMensagemDeCorpo(
  corpo: unknown,
  mensagemFallback: string,
): { message: string } {
  if (
    typeof corpo === "object" &&
    corpo !== null &&
    "message" in corpo &&
    typeof (corpo as { message: unknown }).message === "string"
  ) {
    const m = (corpo as { message: string }).message.trim();
    return { message: m || mensagemFallback };
  }
  return { message: mensagemFallback };
}

/**
 * Resposta de sucesso com apenas `message` (ex.: POST criar-conta).
 */
export async function lerRespostaSucessoComMensagem(
  resposta: Response,
  mensagemFallback: string,
): Promise<{ message: string }> {
  const corpo = await lerCorpoJsonResposta(resposta);
  if (corpo === null) {
    return { message: mensagemFallback };
  }
  return extrairMensagemDeCorpo(corpo, mensagemFallback);
}

/**
 * Extrai `id` e `message`; usa fallbacks quando faltar ou vier vazio.
 */
export function extrairIdEMensagemDeCorpo(
  corpo: unknown,
  idFallback: string,
  mensagemFallback: string,
): { id: string; message: string } {
  if (typeof corpo !== "object" || corpo === null) {
    return { id: idFallback, message: mensagemFallback };
  }
  const o = corpo as { id?: unknown; message?: unknown };
  const id =
    typeof o.id === "string" && o.id.trim().length > 0
      ? o.id.trim()
      : idFallback;
  const msg =
    typeof o.message === "string" && o.message.trim().length > 0
      ? o.message.trim()
      : mensagemFallback;
  return { id, message: msg };
}

/**
 * Resposta de sucesso com `id` e `message` (ex.: PUT atualizar).
 */
export async function lerRespostaSucessoComIdEMensagem(
  resposta: Response,
  idFallback: string,
  mensagemFallback: string,
): Promise<{ id: string; message: string }> {
  const corpo = await lerCorpoJsonResposta(resposta);
  if (corpo === null) {
    return { id: idFallback, message: mensagemFallback };
  }
  return extrairIdEMensagemDeCorpo(corpo, idFallback, mensagemFallback);
}
