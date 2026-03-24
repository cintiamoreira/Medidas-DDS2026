import { z } from 'zod';

const idQuery = z.preprocess(
  (val) => {
    if (Array.isArray(val)) return val[0];
    return val;
  },
  z.string().min(1, { message: 'id é obrigatório' })
);

export const schemaQueryIdMedida = z.object({
  id: idQuery,
});

const numeroMedida = z.coerce.number().finite();

const camposMedida = {
  idade: numeroMedida,
  peso: numeroMedida,
  altura: numeroMedida,
  medidaBracoEsquerdo: numeroMedida,
  medidaBracoDireito: numeroMedida,
  medidaCoxaEsquerda: numeroMedida,
  medidaCoxaDireita: numeroMedida,
  medidaPanturrilhaEsquerda: numeroMedida,
  medidaPanturrilhaDireita: numeroMedida,
  medidaTorax: numeroMedida,
  medidaQuadril: numeroMedida,
};

export const schemaMedidaCriar = z.object(camposMedida);

export const schemaMedidaAtualizar = z
  .object({
    id: z.string().min(1, { message: 'id é obrigatório' }).trim(),
    ...Object.fromEntries(
      Object.keys(camposMedida).map((k) => [k, camposMedida[k].optional()])
    ),
  })
  .strict();
