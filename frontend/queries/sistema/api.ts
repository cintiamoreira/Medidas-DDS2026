import {
  MENSAGEM_ERRO_PADRAO,
  lerMensagemErroResposta,
} from "@/helpers/respostaErro";
import { lerCorpoJsonResposta } from "@/helpers/respostaSucesso";
import type { TypeHealthResposta } from "./types";

const MENSAGEM_ERRO_HEALTH = "Não foi possível verificar o estado do servidor.";
const HEALTH_TIMEOUT_MS = 2000;
const MENSAGEM_TIMEOUT_HEALTH =
  "Tempo esgotado ao verificar o estado do servidor.";

function eTimeoutOuAbortFetch(erro: unknown): boolean {
  if (typeof erro !== "object" || erro === null) return false;
  const nome =
    "name" in erro && typeof (erro as { name: unknown }).name === "string"
      ? (erro as { name: string }).name
      : "";
  const msg =
    "message" in erro &&
    typeof (erro as { message: unknown }).message === "string"
      ? (erro as { message: string }).message.toLowerCase()
      : "";
  return (
    nome === "AbortError" ||
    nome === "TimeoutError" ||
    msg.includes("signal timed out") ||
    msg.includes("the operation was aborted") ||
    msg.includes("aborted")
  );
}

export async function getHealthApi(): Promise<TypeHealthResposta> {
  let resposta: Response;
  try {
    resposta = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
  } catch (erro) {
    if (eTimeoutOuAbortFetch(erro)) {
      throw new Error(MENSAGEM_TIMEOUT_HEALTH);
    }
    throw erro;
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
