type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

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
