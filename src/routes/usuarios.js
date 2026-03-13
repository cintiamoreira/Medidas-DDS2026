import express from 'express';
import { auth } from '../config/firebase.js';
const routerUsuarios = express.Router();

routerUsuarios.post('/criar-conta', async (req, res) => {
  if (!req.body.email || !req.body.senha) {
    res.status(400).json({ error: 'Faltando dados para criação de conta' });
  } else {
    try {
      await auth.createUser({
        email: req.body.email,
        password: req.body.senha,
      });
      res.status(200).json({ message: 'Conta criada com sucesso' });
    } catch (erro) {
      res.status(500).json({ message: 'Houve um erro para criacao da conta' });
    }
  }
});

routerUsuarios.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.senha) {
    console.log('ERRO');
    res.status(400).json({ error: 'Faltando dados para login' });
  } else {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: req.body.email,
          password: req.body.senha,
          returnSecureToken: true,
        }),
      });
      if (!resposta.ok) {
        throw new Error();
      }
      const dados = await response.json();

      res.status(200).json(dados);
    } catch (erro) {
      res
        .status(500)
        .json({ message: 'Houve um problema para realizar o login' });
    }
  }
});

export default routerUsuarios;
