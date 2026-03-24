import { z } from './zod-instance.js';

const numeroCampo = () => z.coerce.number().finite().openapi({ example: 70 });

export const schemaQueryIdMedida = z
  .object({
    id: z
      .string()
      .min(1, { message: 'id é obrigatório' })
      .openapi({ example: 'documentoFirestoreId' }),
  })
  .openapi('MedidaQueryId');

const camposMedida = {
  idade: numeroCampo(),
  peso: numeroCampo(),
  altura: numeroCampo(),
  medidaBracoEsquerdo: numeroCampo(),
  medidaBracoDireito: numeroCampo(),
  medidaCoxaEsquerda: numeroCampo(),
  medidaCoxaDireita: numeroCampo(),
  medidaPanturrilhaEsquerda: numeroCampo(),
  medidaPanturrilhaDireita: numeroCampo(),
  medidaTorax: numeroCampo(),
  medidaQuadril: numeroCampo(),
};

export const schemaMedidaCriar = z.object(camposMedida).openapi('MedidaCriar');

export const schemaMedidaAtualizar = z
  .object({
    id: z
      .string()
      .min(1, { message: 'id é obrigatório' })
      .trim()
      .openapi({ example: 'documentoFirestoreId' }),
    ...Object.fromEntries(
      Object.keys(camposMedida).map((k) => [k, camposMedida[k].optional()])
    ),
  })
  .strict()
  .openapi('MedidaAtualizar');
