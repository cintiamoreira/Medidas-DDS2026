export const MENSAGEM_ERRO_PADRAO = "Não foi possível concluir o pedido.";

export async function lerMensagemErroResposta(
  resposta: Response,
  mensagemPadrao: string = MENSAGEM_ERRO_PADRAO,
): Promise<string> {
  let corpoDoErro: unknown;
  try {
    corpoDoErro = await resposta.json();
  } catch {
    return mensagemPadrao;
  }
  if (typeof corpoDoErro === "object" && corpoDoErro !== null) {
    const o = corpoDoErro as { message?: unknown; error?: unknown };
    if (typeof o.message === "string" && o.message.trim().length > 0) {
      return o.message;
    }
    if (typeof o.error === "string" && o.error.trim().length > 0) {
      return o.error;
    }
  }
  return mensagemPadrao;
}

export function lerMensagemErroDesconhecido(
  erro: unknown,
  mensagemFallback: string = MENSAGEM_ERRO_PADRAO,
): string {
  if (erro instanceof Error) {
    const m = erro.message.trim();
    return m.length > 0 ? m : mensagemFallback;
  }
  if (
    typeof erro === "object" &&
    erro !== null &&
    "message" in erro &&
    typeof (erro as { message: unknown }).message === "string"
  ) {
    const m = (erro as { message: string }).message.trim();
    return m.length > 0 ? m : mensagemFallback;
  }
  return mensagemFallback;
}
