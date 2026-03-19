import express from 'express';
import { db } from '../config/firebase.js';

const routerMedidas = express.Router();

routerMedidas.get('/ler', async (req, res) => {
  console.log('GET /ler');
});
routerMedidas.get('/ler-todas', async (req, res) => {
  console.log('GET /ler-todas');
  if (!db) {
    return res.status(503).json({ error: 'Firestore não disponível' });
  }
  try {
    const snapshot = await db.collection('medidas').get();
    const medidas = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(medidas);
  } catch (erro) {
    console.error('Erro ao ler todas as medidas:', erro);
    res.status(500).json({ error: 'Erro ao ler todas as medidas' });
  }
});
routerMedidas.post('/criar', async (req, res) => {
  console.log('POST /criar');
  if (!db) {
    return res.status(503).json({ error: 'Firestore não disponível' });
  }
  try {
    const payload = req.body || {};
    const ref = await db.collection('medidas').add({
      ...payload,
      createdAt: new Date(),
    });
    res.status(201).json({ id: ref.id, message: 'Medida criada' });
  } catch (erro) {
    console.error('Erro ao criar medida:', erro);
    res.status(500).json({ error: 'Erro ao criar medida' });
  }
});
routerMedidas.put('/atualizar', async (req, res) => {
  console.log('PUT /atualizar');
});
routerMedidas.delete('/remover', async (req, res) => {
  console.log('DELETE /remover');
});

export default routerMedidas;
