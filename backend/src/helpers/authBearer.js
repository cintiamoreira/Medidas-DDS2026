import { auth } from '../config/firebase.js';

/**
 * Lê o JWT do header `Authorization: Bearer <token>`.
 * @returns {string|null}
 */
export function extrairBearerToken(req) {
  const raw = req.headers?.authorization;
  if (!raw || typeof raw !== 'string') return null;
  const m = /^Bearer\s+(\S+)$/i.exec(raw.trim());
  return m ? m[1] : null;
}

/**
 * Valida o idToken do Firebase e devolve o UID do usuário.
 * @returns {Promise<{ ok: true, uid: string } | { ok: false, status: number, error: string }>}
 */
export async function verificarUidDoIdToken(req) {
  if (!auth) {
    return {
      ok: false,
      status: 503,
      error: 'Autenticação não disponível',
    };
  }
  const token = extrairBearerToken(req);
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Header Authorization: Bearer <idToken> é obrigatório',
    };
  }
  try {
    const decoded = await auth.verifyIdToken(token);
    return { ok: true, uid: decoded.uid };
  } catch {
    return {
      ok: false,
      status: 401,
      error: 'Token inválido ou expirado',
    };
  }
}
