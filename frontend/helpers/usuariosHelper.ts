export async function limparSessaoCookies(): Promise<void> {
  await fetch("/api/auth/sessao", {
    method: "DELETE",
    credentials: "same-origin",
  });
}

/** `userId` gravado no cookie httpOnly (via GET /api/auth/sessao). */
export async function getUserIdDaSessao(): Promise<string | null> {
  const resposta = await fetch("/api/auth/sessao", {
    credentials: "same-origin",
  });
  if (!resposta.ok) return null;
  const dados = (await resposta.json()) as { userId?: string | null };
  return typeof dados.userId === "string" && dados.userId.length > 0
    ? dados.userId
    : null;
}

/** Indica se o cookie `id_token` está presente (verificado no servidor). */
export async function temSessaoCookie(): Promise<boolean> {
  const resposta = await fetch("/api/auth/sessao", {
    credentials: "same-origin",
  });
  return resposta.ok;
}
