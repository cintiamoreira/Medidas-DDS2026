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
import { mapearErroFirebaseAuthParaCliente } from '../helpers/erroFirebaseAuth.js';
import { normalizarQueryId } from '../utils/normalizarQuery.js';

const routerUsuarios = express.Router();

const MENSAGEM_ERRO_CRIAR_CONTA_GENERICO =
  'Não foi possível criar a conta. Tente novamente dentro de momentos.';

routerUsuarios.post(
  '/criar-conta',
  validarEExecutar({
    schema: schemaUsuarioCriarConta,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('POST /criar-conta');
      const { email, senha, nome } = data;
      if (!authFirebase) {
        console.error(
          'criar-conta: Firebase Admin indisponível (credenciais em falta ou inválidas no servidor)'
        );
        return res.status(503).json({
          message:
            'O serviço de contas não está disponível. Contacte o suporte ou tente mais tarde.',
        });
      }
      try {
        await authFirebase.createUser({
          email,
          password: senha,
          displayName: nome,
        });
        res.status(200).json({ message: 'Conta criada com sucesso' });
      } catch (erro) {
        const mapeado = mapearErroFirebaseAuthParaCliente(erro);
        if (mapeado) {
          return res.status(mapeado.status).json({ message: mapeado.message });
        }
        console.error('criar-conta: erro não mapeado', erro);
        res.status(500).json({ message: MENSAGEM_ERRO_CRIAR_CONTA_GENERICO });
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
  '/informacoes',
  validarEExecutar({
    schema: schemaQueryIdUsuario,
    obterDados: (req) => req.query ?? {},
    executar: async (data, req, res) => {
      const { id } = data;
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
