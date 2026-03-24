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

export const schemaQueryIdUsuario = z
  .object({
    id: z
      .string()
      .min(1, { message: 'id é obrigatório' })
      .openapi({ example: 'firebaseUidDoUsuario' }),
  })
  .openapi('UsuarioQueryId');
