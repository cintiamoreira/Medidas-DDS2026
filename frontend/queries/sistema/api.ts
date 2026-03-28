import {
  MENSAGEM_ERRO_PADRAO,
  lerMensagemErroResposta,
} from "@/helpers/respostaErro";
import { lerCorpoJsonResposta } from "@/helpers/respostaSucesso";
import type { TypeHealthResposta } from "./types";

const MENSAGEM_ERRO_HEALTH = "Não foi possível verificar o estado do servidor.";
const HEALTH_TIMEOUT_MS = 2000;
const MENSAGEM_TIMEOUT_HEALTH = "Problema ao contactar o servidor.";

export async function getHealthApi(): Promise<TypeHealthResposta> {
  let resposta: Response;
  try {
    resposta = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
  } catch {
    throw new Error(MENSAGEM_TIMEOUT_HEALTH);
  }
  if (!resposta.ok) {
    throw new Error(
      await lerMensagemErroResposta(resposta, MENSAGEM_ERRO_HEALTH),
    );
  }
  const corpo = await lerCorpoJsonResposta(resposta);
  if (
    typeof corpo === "object" &&
    corpo !== null &&
    "status" in corpo &&
    typeof (corpo as { status: unknown }).status === "string"
  ) {
    return { status: (corpo as { status: string }).status };
  }
  throw new Error(MENSAGEM_ERRO_PADRAO);
}
