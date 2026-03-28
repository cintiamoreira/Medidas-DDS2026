export function validarEExecutar({ schema, obterDados, executar }) {
  return async (req, res, next) => {
    const parsed = schema.safeParse(obterDados(req));
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const error =
        issue?.message && String(issue.message).trim().length > 0
          ? String(issue.message).trim()
          : 'Dados inválidos.';
      return res.status(400).json({ error });
    }
    return executar(parsed.data, req, res, next);
  };
}
