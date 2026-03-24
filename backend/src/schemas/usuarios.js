import { z } from './zod-instance.js';

export const schemaUsuarioEmailSenha = z
  .object({
    email: z
      .string()
      .email({ message: 'E-mail inválido' })
      .openapi({ example: 'usuario@exemplo.com' }),
    senha: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
      .openapi({ example: 'senha123', minLength: 6 }),
  })
  .openapi('UsuarioEmailSenha');

export const schemaUsuarioCriarConta = schemaUsuarioEmailSenha
  .extend({
    nome: z
      .string()
      .min(1, { message: 'Nome é obrigatório' })
      .trim()
      .openapi({ example: 'Maria Silva' }),
  })
  .openapi('UsuarioCriarConta');

export const schemaUsuarioAtualizar = z
  .object({
    id: z
      .string()
      .min(1, { message: 'id é obrigatório' })
      .openapi({ example: 'firebaseUidDoUsuario' }),
    nome: z
      .string()
      .min(1, { message: 'Nome é obrigatório' })
      .trim()
      .openapi({ example: 'Maria Silva' }),
  })
  .openapi('UsuarioAtualizar');

/** Campos do Identity Toolkit usados para sessão (cookies / storage no cliente). */
export const schemaLoginResposta = z
  .object({
    idToken: z.string().openapi({
      description: 'JWT do Firebase para Authorization: Bearer (curta duração)',
    }),
    refreshToken: z.string().openapi({
      description: 'Token para renovar o idToken sem novo login',
    }),
    expiresIn: z.string().openapi({
      description: 'TTL do idToken em segundos (string numérica)',
      example: '3600',
    }),
    userId: z.string().openapi({
      description: 'UID do usuário no Firebase (localId)',
    }),
    email: z.string().email().nullable().openapi({
      description: 'E-mail da conta autenticada',
    }),
  })
  .openapi('LoginResposta');

export const schemaQueryIdUsuario = z
  .object({
    id: z
      .string()
      .min(1, { message: 'id é obrigatório' })
      .openapi({ example: 'firebaseUidDoUsuario' }),
  })
  .openapi('UsuarioQueryId');
