import { z } from 'zod';

export const schemaUsuarioEmailSenha = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});
