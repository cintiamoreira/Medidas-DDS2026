export function respostaErroValidacao(res, erro) {
  return res.status(400).json({
    error: 'Dados inválidos',
    detalhes: erro.flatten(),
  });
}
