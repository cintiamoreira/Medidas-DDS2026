import type { NextApiRequest, NextApiResponse } from "next";

const c = (name: string, value: string, maxAge: number) =>
  `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;

export default function configurarCookiesDeSessao(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const b = req.body as {
    idToken?: string;
    refreshToken?: string;
    userId?: string;
    expiresIn?: string;
  };
  if (!b?.idToken || !b?.refreshToken || !b?.userId) {
    return res.status(400).end();
  }
  const idAge = Math.max(60, parseInt(String(b.expiresIn), 10) || 3600);
  const longAge = 14 * 24 * 3600; // 14 dias
  res.setHeader("Set-Cookie", [
    c("id_token", b.idToken, idAge),
    c("refresh_token", b.refreshToken, longAge),
    c("user_id", b.userId, longAge),
  ]);
  return res.status(204).end();
}
