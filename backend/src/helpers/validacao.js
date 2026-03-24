export function validarEExecutar({ schema, obterDados, executar }) {
  return async (req, res, next) => {
    const parsed = schema.safeParse(obterDados(req));
    if (!parsed.success) {
      return res.status(400).json({ error: 'erro de validação de dados' });
    }
    return executar(parsed.data, req, res, next);
  };
}
