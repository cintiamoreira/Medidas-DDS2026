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
