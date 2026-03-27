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

/**
 * Obtém o id_token da sessão (cookie httpOnly) via GET /api/auth/sessao
 * e devolve o header Authorization no formato esperado pelo backend.
 */
export async function getAuthorizationBearerHeaders(): Promise<
  Record<string, string>
> {
  const respostaCookie = await fetch("/api/auth/sessao", {
    credentials: "same-origin",
  });
  if (!respostaCookie.ok) return {};
  const dadosCookie = (await respostaCookie.json()) as {
    idToken?: string | null;
  };
  if (typeof dadosCookie.idToken !== "string" || !dadosCookie.idToken)
    return {};
  return { Authorization: `Bearer ${dadosCookie.idToken}` };
}
