/** Formato Firestore Timestamp ao serializar em JSON */
type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

/**
 * Converte createdAt do Firestore (string ISO ou Timestamp) em string formatada em pt-BR.
 * Usa o mesmo formato em toda a aplicação (data e hora).
 */
export function formatarCreatedAt(raw: unknown): string {
  if (raw == null) return "—";
  if (typeof raw === "string") return new Date(raw).toLocaleString("pt-BR");
  const t = raw as FirestoreTimestamp;
  if (typeof t._seconds === "number")
    return new Date(
      t._seconds * 1000 + (t._nanoseconds ?? 0) / 1e6,
    ).toLocaleString("pt-BR");
  return "—";
}
