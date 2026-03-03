import express from 'express';
const routerUsuarios = express.Router();

routerUsuarios.get('/', (req, res) => {
  res.json({ message: 'USUÁRIOS' });
});

routerUsuarios.get('/informacoes', (req, res) => {
  res.json({ message: 'INFORMAÇÕES' });
});

export default routerUsuarios;
