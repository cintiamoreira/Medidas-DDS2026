import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './config/firebase.js';
import routerUsuarios from './routes/usuarios.js';

const app = express();
const PORT = process.env.PORT || 4020;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// ESCUTANDO VIA HTTP

app.get('/health', (req, res) => {
  console.log('GET /health');
  res.json({ status: 'ok' });
});

app.use('/usuarios', routerUsuarios);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
