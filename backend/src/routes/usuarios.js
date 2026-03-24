import express from 'express';
import { auth } from '../config/firebase.js';
import { validarEExecutar } from '../helpers/validacao.js';
import {
  schemaQueryIdUsuario,
  schemaUsuarioCriarConta,
  schemaUsuarioEmailSenha,
} from '../schemas/usuarios.js';
import { normalizarQueryId } from '../utils/normalizarQuery.js';

const routerUsuarios = express.Router();

routerUsuarios.post(
  '/criar-conta',
  validarEExecutar({
    schema: schemaUsuarioCriarConta,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('POST /criar-conta');
      const { email, senha, nome } = data;
      try {
        await auth.createUser({
          email,
          password: senha,
          displayName: nome,
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
            email: email,
            password: senha,
            returnSecureToken: true,
          }),
        });
        if (!response.ok) {
          throw new Error('Resposta não ok');
        }
        const dados = await response.json();
        const {
          idToken,
          refreshToken,
          expiresIn,
          localId,
          email: emailResposta,
        } = dados;
        if (!idToken || !refreshToken || !localId) {
          return res.status(502).json({
            message: 'Resposta de autenticação inválida',
          });
        }

        res.status(200).json({
          idToken,
          refreshToken,
          expiresIn: String(expiresIn ?? ''),
          userId: localId,
          email: emailResposta ?? null,
        });
      } catch (erro) {
        res
          .status(500)
          .json({ message: 'Houve um problema para realizar o login', erro });
      }
    },
  })
);

routerUsuarios.get(
  '/informacoes',
  validarEExecutar({
    schema: schemaQueryIdUsuario,
    obterDados: (req) => req.query ?? {},
    executar: async (data, req, res) => {
      const { id } = data;
      try {
        const userRecord = await auth.getUser(id);
        res.status(200).json({
          email: userRecord.email ?? null,
          nome: userRecord.displayName ?? null,
        });
      } catch (erro) {
        if (erro?.code === 'auth/user-not-found') {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(500).json({
          message: 'Erro ao buscar informações do usuário',
        });
      }
    },
  })
);

routerUsuarios.delete(
  '/remover',
  validarEExecutar({
    schema: schemaQueryIdUsuario,
    obterDados: (req) => normalizarQueryId(req.query),
    executar: async (data, req, res) => {
      const { id } = data;
      if (!auth) {
        return res.status(503).json({ error: 'Autenticação não disponível' });
      }
      try {
        await auth.deleteUser(id);
        res.status(200).json({ id, message: 'Usuário removido' });
      } catch (erro) {
        if (erro?.code === 'auth/user-not-found') {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        console.error('Erro ao remover usuário:', erro);
        res.status(500).json({ message: 'Erro ao remover usuário' });
      }
    },
  })
);

export default routerUsuarios;
