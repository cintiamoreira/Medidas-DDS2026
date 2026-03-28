import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './config/firebase.js';
import routerUsuarios from './routes/usuarios.js';
import routerMedidas from './routes/medidas.js';

const app = express();
const PORT = process.env.PORT || 4020;

const ambienteDesenvolvimento = process.env.NODE_ENV === 'development';

function normalizarOrigemCors(valor) {
  if (!valor || typeof valor !== 'string') return null;
  let s = valor.trim();
  if (s.endsWith('/*')) s = s.slice(0, -2);
  while (s.endsWith('/')) s = s.slice(0, -1);
  try {
    return new URL(s).origin;
  } catch {
    return null;
  }
}

function origensCorsPermitidas() {
  const bruto = process.env.FRONTEND_URL || 'http://localhost:3000';
  return bruto
    .split(',')
    .map((p) => normalizarOrigemCors(p))
    .filter(Boolean);
}

app.use(
  cors({
    origin(origin, callback) {
      const permitidas = origensCorsPermitidas();
      if (!origin) {
        callback(null, true);
        return;
      }
      if (permitidas.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('GET /health');
  res.json({ status: 'ok' });
});

app.use('/usuarios', routerUsuarios);
app.use('/medidas', routerMedidas);

async function iniciar() {
  if (ambienteDesenvolvimento) {
    const { swaggerSpec, swaggerUiMiddleware, swaggerUiSetup } =
      await import('./swagger.js');
    app.get('/openapi.json', (req, res) => {
      res.json(swaggerSpec);
    });
    app.use('/api-docs', swaggerUiMiddleware, swaggerUiSetup);
    console.log('Documentação: /api-docs e /openapi.json');
  }

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

iniciar();
