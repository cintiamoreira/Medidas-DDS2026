import express from 'express';
import { auth } from '../config/firebase.js';
import { schemaUsuarioEmailSenha } from '../schemas/usuarios.js';
import { respostaErroValidacao } from '../validation/respostaErro.js';

const routerUsuarios = express.Router();

routerUsuarios.post('/criar-conta', async (req, res) => {
  console.log('POST /criar-conta');
  const parsed = schemaUsuarioEmailSenha.safeParse(req.body ?? {});
  if (!parsed.success) {
    return respostaErroValidacao(res, parsed.error);
  }
  const { email, senha } = parsed.data;
  try {
    await auth.createUser({
      email,
      password: senha,
    });
    res.status(200).json({ message: 'Conta criada com sucesso' });
  } catch {
    res.status(500).json({ message: 'Houve um erro para criacao da conta' });
  }
});

routerUsuarios.post('/login', async (req, res) => {
  console.log('POST /login');
  const parsed = schemaUsuarioEmailSenha.safeParse(req.body ?? {});
  if (!parsed.success) {
    return respostaErroValidacao(res, parsed.error);
  }
  const { email, senha } = parsed.data;
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
});

export default routerUsuarios;
