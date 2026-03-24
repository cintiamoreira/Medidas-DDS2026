export function normalizarQueryId(query) {
  const raw = query?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return { id };
}
