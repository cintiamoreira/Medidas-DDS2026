import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Medidas DDS API',
      version: '1.0.0',
      description:
        'Documentação OpenAPI gerada a partir de comentários JSDoc (`@openapi`).',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:4020',
        description: 'Servidor local',
      },
    ],
  },
  apis: [join(__dirname, 'swagger', 'paths.js')],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Medidas API — Docs',
});
