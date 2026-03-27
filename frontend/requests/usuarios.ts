const BASE_ROTA = "/usuarios";

/** Resposta de GET /usuarios/informacoes?id= */
export type TypeInformacoesUsuario = {
  email: string | null;
  nome: string | null;
};

/** Carrega nome e e-mail da conta no backend (Firebase Auth). */
export async function getUsuariosInformacoes(
  userId: string,
): Promise<TypeInformacoesUsuario> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${BASE_ROTA}/informacoes`,
  );
  url.searchParams.set("id", userId);
  const resposta = await fetch(url.toString());
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as informações da conta.");
  }
  return (await resposta.json()) as TypeInformacoesUsuario;
}

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
