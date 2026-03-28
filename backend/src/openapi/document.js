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
import {
  schemaLoginResposta,
  schemaQueryIdUsuario,
  schemaUsuarioAtualizar,
  schemaUsuarioCriarConta,
  schemaUsuarioEmailSenha,
} from '../schemas/usuarios.js';

const registry = new OpenAPIRegistry();

const ErroValidacao = z
  .object({
    error: z.string(),
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

const ContaCriada = z.object({ message: z.string() }).openapi('ContaCriada');

const InformacoesUsuario = z
  .object({
    email: z.string().nullable(),
    nome: z.string().nullable(),
  })
  .openapi('InformacoesUsuario');

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
  summary: 'Health',
  tags: ['Sistema'],
  responses: {
    200: {
      description: 'OK',
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
        'application/json': { schema: schemaUsuarioCriarConta },
      },
    },
  },
  responses: {
    200: {
      description: 'Criada',
      content: { 'application/json': { schema: ContaCriada } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    500: { description: 'Erro no servidor' },
  },
});

const UsuarioAtualizado = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .openapi('UsuarioAtualizado');

registry.registerPath({
  method: 'put',
  path: '/usuarios/atualizar',
  summary: 'Atualizar perfil',
  tags: ['Usuários'],
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
    body: {
      content: {
        'application/json': { schema: schemaUsuarioAtualizar },
      },
    },
  },
  responses: {
    200: {
      description: 'Atualizado',
      content: { 'application/json': { schema: UsuarioAtualizado } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    403: {
      description: 'Proibido',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: { description: 'Não encontrado' },
    500: { description: 'Erro no servidor' },
    503: { description: 'Indisponível' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/usuarios/informacoes',
  summary: 'Dados do perfil',
  tags: ['Usuários'],
  request: {
    query: schemaQueryIdUsuario,
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Perfil',
      content: { 'application/json': { schema: InformacoesUsuario } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    403: {
      description: 'Proibido',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: { description: 'Não encontrado' },
    503: { description: 'Indisponível' },
    500: { description: 'Erro no servidor' },
  },
});

const UsuarioRemovido = z
  .object({
    id: z.string(),
    message: z.string(),
  })
  .openapi('UsuarioRemovido');

registry.registerPath({
  method: 'delete',
  path: '/usuarios/remover',
  summary: 'Remover conta',
  tags: ['Usuários'],
  request: {
    query: schemaQueryIdUsuario,
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Removida',
      content: { 'application/json': { schema: UsuarioRemovido } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    403: {
      description: 'Proibido',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: { description: 'Não encontrado' },
    503: { description: 'Indisponível' },
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
      description: 'Sessão',
      content: { 'application/json': { schema: schemaLoginResposta } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    502: { description: 'Auth inválida' },
    500: { description: 'Erro no servidor' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/medidas/ler',
  summary: 'Obter medida',
  tags: ['Medidas'],
  request: {
    query: schemaQueryIdMedida,
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Medida',
      content: { 'application/json': { schema: MedidaDocumento } },
    },
    400: {
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Indisponível',
      content: { 'application/json': { schema: ErroSimples } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/medidas/ler-todas',
  summary: 'Listar medidas',
  tags: ['Medidas'],
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Lista',
      content: { 'application/json': { schema: ListaMedidasResumo } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Indisponível',
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
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
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
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Indisponível',
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
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
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
      description: 'Validação',
      content: { 'application/json': { schema: ErroValidacao } },
    },
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Indisponível',
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
    headers: z.object({
      authorization: z.string().openapi({
        description: 'Bearer',
        example: 'Bearer eyJhbGciOiJSUzI1NiIs...',
      }),
    }),
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
    401: {
      description: 'Não autorizado',
      content: { 'application/json': { schema: ErroSimples } },
    },
    404: {
      description: 'Não encontrada',
      content: { 'application/json': { schema: ErroSimples } },
    },
    503: {
      description: 'Indisponível',
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
      title: 'Medidas API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:4020',
      },
    ],
  });
}
