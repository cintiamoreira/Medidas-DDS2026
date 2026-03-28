import express from 'express';
import { authFirebase } from '../config/firebase.js';
import { verificarUidDoIdToken } from '../helpers/authBearer.js';
import { validarEExecutar } from '../helpers/validacao.js';
import {
  schemaQueryIdUsuario,
  schemaUsuarioAtualizar,
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
      const { email, senha, nome } = data;
      if (!authFirebase) {
        return res.status(503).json({
          message:
            'Firebase Admin não inicializado (ver config/firebase-service-account.json).',
        });
      }
      try {
        await authFirebase.createUser({
          email,
          password: senha,
          displayName: nome,
        });
        res.status(200).json({ message: 'Conta criada com sucesso' });
      } catch {
        res.status(500).json({ message: 'Houve um erro para criar a conta' });
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
      const { email, senha } = data;
      const apiKey = process.env.FIREBASE_WEB_API_KEY;
      if (!apiKey || String(apiKey).trim() === '') {
        console.error(
          'POST /login: defina FIREBASE_WEB_API_KEY (Console Firebase → Project settings → General → Web API Key)'
        );
        return res.status(503).json({
          message:
            'Servidor sem FIREBASE_WEB_API_KEY. É obrigatória para o login e é independente do ficheiro JSON da conta de serviço.',
        });
      }
      try {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: senha,
            returnSecureToken: true,
          }),
        });
        const dados = await response.json();
        if (!response.ok) {
          const codigo = dados?.error?.message;
          console.warn('POST /login Identity Toolkit:', codigo);
          const credenciais = [
            'EMAIL_NOT_FOUND',
            'INVALID_PASSWORD',
            'INVALID_LOGIN_CREDENTIALS',
            'USER_DISABLED',
          ].includes(codigo);
          return res.status(credenciais ? 401 : 502).json({
            message: credenciais
              ? 'E-mail ou senha incorretos.'
              : 'Falha ao contactar o serviço de autenticação.',
          });
        }
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
        console.error('POST /login:', erro);
        res.status(500).json({
          message: 'Houve um problema para realizar o login',
        });
      }
    },
  })
);

routerUsuarios.put(
  '/atualizar',
  validarEExecutar({
    schema: schemaUsuarioAtualizar,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      const authResult = await verificarUidDoIdToken(req);
      if (authResult.ok === false) {
        return res.status(authResult.status).json({ error: authResult.error });
      }
      const { id, nome } = data;
      if (id !== authResult.uid) {
        return res.status(403).json({
          error: 'Não é possível atualizar o perfil de outro utilizador',
        });
      }
      if (!authFirebase) {
        return res.status(503).json({ error: 'Autenticação não disponível' });
      }
      try {
        await authFirebase.updateUser(id, { displayName: nome });
        res.status(200).json({ id, message: 'Usuário atualizado' });
      } catch (erro) {
        if (erro?.code === 'auth/user-not-found') {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        console.error('Erro ao atualizar usuário:', erro);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
      }
    },
  })
);

routerUsuarios.get(
  '/ler',
  validarEExecutar({
    schema: schemaQueryIdUsuario,
    obterDados: (req) => req.query ?? {},
    executar: async (data, req, res) => {
      const authResult = await verificarUidDoIdToken(req);
      if (authResult.ok === false) {
        return res.status(authResult.status).json({ error: authResult.error });
      }
      const { id } = data;
      if (id !== authResult.uid) {
        return res.status(403).json({
          error: 'Não é possível consultar o perfil de outro utilizador',
        });
      }
      if (!authFirebase) {
        return res.status(503).json({ error: 'Autenticação não disponível' });
      }
      try {
        const userRecord = await authFirebase.getUser(id);
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
      const authResult = await verificarUidDoIdToken(req);
      if (authResult.ok === false) {
        return res.status(authResult.status).json({ error: authResult.error });
      }
      const { id } = data;
      if (id !== authResult.uid) {
        return res.status(403).json({
          error: 'Não é possível remover a conta de outro utilizador',
        });
      }
      if (!authFirebase) {
        return res.status(503).json({ error: 'Autenticação não disponível' });
      }
      try {
        await authFirebase.deleteUser(id);
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
