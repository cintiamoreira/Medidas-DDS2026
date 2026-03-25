import type { NextApiRequest, NextApiResponse } from "next";

const c = (name: string, value: string, maxAge: number) =>
  `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!req.cookies?.id_token) {
      return res.status(401).json({ message: "não autenticado" });
    }
    return res.status(200).json({
      userId: req.cookies.user_id ?? null,
    });
  }

  if (req.method === "POST") {
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
    const longAge = 14 * 24 * 3600;
    res.setHeader("Set-Cookie", [
      c("id_token", b.idToken, idAge),
      c("refresh_token", b.refreshToken, longAge),
      c("user_id", b.userId, longAge),
    ]);
    return res.status(204).end();
  }

  if (req.method === "DELETE") {
    const expirar = "Max-Age=0";
    const base = `Path=/; ${expirar}; SameSite=Lax`;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const limpar = (nome: string) => `${nome}=; ${base}${secure}; HttpOnly`;
    res.setHeader("Set-Cookie", [
      limpar("id_token"),
      limpar("refresh_token"),
      limpar("user_id"),
    ]);
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).end();
}
