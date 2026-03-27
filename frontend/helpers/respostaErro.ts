/** Mensagem usada quando o corpo de erro não é JSON ou não traz `message` / `error`. */
export const MENSAGEM_ERRO_PADRAO = "Não foi possível concluir o pedido.";

/**
 * Lê `message` ou `error` do JSON de uma resposta HTTP de erro.
 */
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
