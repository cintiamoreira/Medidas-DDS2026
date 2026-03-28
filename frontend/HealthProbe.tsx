"use client";

import { lerMensagemErroDesconhecido } from "@/helpers/respostaErro";
import { useHealth } from "@/queries/sistema/query";
import { AlertCircle } from "lucide-react";

const MENSAGEM_FALLBACK_HEALTH = "Falha ao contactar o servidor.";

export function HealthTooltip() {
  const noCliente = typeof window !== "undefined";
  const { isError, error } = useHealth({ enabled: noCliente });

  if (!isError) return null;

  const mensagem = lerMensagemErroDesconhecido(error, MENSAGEM_FALLBACK_HEALTH);

  return (
    <div className="group fixed top-4 right-4 z-50">
      <button
        type="button"
        className="inline-flex cursor-help rounded-full border border-red-500/50 bg-background/95 p-2 text-red-600 shadow-md backdrop-blur-sm transition hover:bg-red-500/10"
        aria-label={mensagem}
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
      </button>
      <div
        className="pointer-events-none absolute top-full right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-red-500/30 bg-background px-3 py-2 text-left text-sm leading-snug text-foreground shadow-lg opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
        role="tooltip"
      >
        {mensagem}
      </div>
    </div>
  );
}
