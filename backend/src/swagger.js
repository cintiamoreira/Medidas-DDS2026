import swaggerUi from 'swagger-ui-express';
import { buildOpenApiDocument } from './openapi/document.js';

export const swaggerSpec = buildOpenApiDocument();

export const swaggerUiMiddleware = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
});
