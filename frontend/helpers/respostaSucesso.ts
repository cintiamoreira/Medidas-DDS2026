export async function lerCorpoJsonResposta(
  resposta: Response,
): Promise<unknown | null> {
  try {
    return await resposta.json();
  } catch {
    return null;
  }
}

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
