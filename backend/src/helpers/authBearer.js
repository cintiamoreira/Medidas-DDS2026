import { authFirebase } from '../config/firebase.js';

export function extrairBearerToken(req) {
  const raw = req.headers?.authorization;
  if (!raw || typeof raw !== 'string') return null;
  const m = /^Bearer\s+(\S+)$/i.exec(raw.trim());
  return m ? m[1] : null;
}

export async function verificarUidDoIdToken(req) {
  if (!authFirebase) {
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
    const decoded = await authFirebase.verifyIdToken(token);

    return { ok: true, uid: decoded.uid };
  } catch {
    return {
      ok: false,
      status: 401,
      error: 'Token inválido ou expirado',
    };
  }
}
