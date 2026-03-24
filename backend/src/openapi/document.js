import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from '../schemas/zod-instance.js';
import {
  schemaMedidaAtualizar,
  schemaMedidaCriar,
  schemaQueryIdMedida,
} from '../schemas/medidas.js';
import { schemaUsuarioEmailSenha } from '../schemas/usuarios.js';

const registry = new OpenAPIRegistry();

const ErroValidacao = z
  .object({
    error: z.string(),
    detalhes: z.unknown().optional(),
  })
  .openapi('ErroValidacao');

const HealthOk = z.object({ status: z.string() }).openapi('HealthOk');

const MedidaCriada = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .openapi('MedidaCriada');

const MedidaAtualizada = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .openapi('MedidaAtualizada');

const MedidaRemovida = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .openapi('MedidaRemovida');

const ErroSimples = z.object({ error: z.string() }).openapi('ErroSimples');

const LoginSucesso = z.record(z.string(), z.unknown()).openapi('LoginSucesso');

const ContaCriada = z.object({ message: z.string() }).openapi('ContaCriada');

const MedidaDocumento = z
  .record(z.string(), z.unknown())
  .openapi('MedidaDocumento');

const ListaMedidasResumo = z
  .array(
    z.object({
      id: z.string(),
      peso: z.number(),
      idade: z.number(),
      createdAt: z.unknown().optional(),
    })
  )
  .openapi('ListaMedidasResumo');

registry.registerPath({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  tags: ['Sistema'],
  responses: {
    200: {
      description: 'API em execução',
      content: {
        'application/json': { schema: HealthOk },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/usuarios/criar-conta',
  summary: 'Criar conta',
  tags: ['Usuários'],
  request: {
    body: {
      content: {
        'application/json': { schema: schemaUsuarioEmailSenha },
      },
    },
  },
  responses: {
    200: {
      description: 'Conta criada',
      content: { 'application/json': { schema: ContaCriada } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    500: { description: 'Erro no servidor' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/usuarios/login',
  summary: 'Login',
  tags: ['Usuários'],
  request: {
    body: {
      content: {
        'application/json': { schema: schemaUsuarioEmailSenha },
      },
    },
  },
  responses: {
    200: {
      description: 'Resposta do Identity Toolkit',
      content: { 'application/json': { schema: LoginSucesso } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    500: { description: 'Erro no servidor' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/medidas/ler',
  summary: 'Ler medida por id',
  tags: ['Medidas'],
  request: {
    query: schemaQueryIdMedida,
  },
  responses: {
    200: {
      description: 'Documento da medida',
      content: { 'application/json': { schema: MedidaDocumento } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Firestore indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/medidas/ler-todas',
  summary: 'Listar medidas',
  tags: ['Medidas'],
  responses: {
    200: {
      description: 'Lista',
      content: { 'application/json': { schema: ListaMedidasResumo } },
    },
    503: {
      description: 'Firestore indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/medidas/criar',
  summary: 'Criar medida',
  tags: ['Medidas'],
  request: {
    body: {
      content: {
        'application/json': { schema: schemaMedidaCriar },
      },
    },
  },
  responses: {
    201: {
      description: 'Criada',
      content: { 'application/json': { schema: MedidaCriada } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    503: {
      description: 'Firestore indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/medidas/atualizar',
  summary: 'Atualizar medida',
  tags: ['Medidas'],
  request: {
    body: {
      content: {
        'application/json': { schema: schemaMedidaAtualizar },
      },
    },
  },
  responses: {
    200: {
      description: 'Atualizada',
      content: { 'application/json': { schema: MedidaAtualizada } },
    },
    400: {
      description: 'Validação ou nenhum campo para atualizar',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Firestore indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/medidas/remover',
  summary: 'Remover medida',
  tags: ['Medidas'],
  request: {
    query: schemaQueryIdMedida,
  },
  responses: {
    200: {
      description: 'Removida',
      content: { 'application/json': { schema: MedidaRemovida } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Firestore indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions, {
  sortComponents: 'alphabetically',
});

export function buildOpenApiDocument() {
  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Medidas DDS API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:4020',
      },
    ],
  });
}
