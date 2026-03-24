import express from 'express';
import { auth } from '../config/firebase.js';
import { validarEExecutar } from '../helpers/validacao.js';
import { schemaUsuarioEmailSenha } from '../schemas/usuarios.js';

const routerUsuarios = express.Router();

routerUsuarios.post(
  '/criar-conta',
  validarEExecutar({
    schema: schemaUsuarioEmailSenha,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('POST /criar-conta');
      const { email, senha } = data;
      try {
        await auth.createUser({
          email,
          password: senha,
        });
        res.status(200).json({ message: 'Conta criada com sucesso' });
      } catch {
        res
          .status(500)
          .json({ message: 'Houve um erro para criacao da conta' });
      }
    },
  })
);

routerUsuarios.post(
  '/login',
  validarEExecutar({
    schema: schemaUsuarioEmailSenha,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('POST /login');
      const { email, senha } = data;
      try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: senha,
            returnSecureToken: true,
          }),
        });
        if (!response.ok) {
          throw new Error('Resposta não ok');
        }
        const dados = await response.json();

        res.status(200).json(dados);
      } catch (erro) {
        res
          .status(500)
          .json({ message: 'Houve um problema para realizar o login', erro });
      }
    },
  })
);

export default routerUsuarios;
