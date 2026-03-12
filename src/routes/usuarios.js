import express from 'express';
const routerUsuarios = express.Router();

routerUsuarios.post('/criar-conta', (req, res) => {
  res.status(400).json({ error: 'Faltando dados para criação de conta' });
  // if (!!req.body.email && !!req.body.senha) {
  res.json({ message: 'TODOS OS DADOS RECEBIDOS' });
  // } else {
  // }
});

routerUsuarios.post('/login', (req, res) => {
  setTimeout(() => {
    res.json({ recebido: true });
  }, 2000);
});

export default routerUsuarios;
