import express from 'express';
import { db } from '../config/firebase.js';

const routerMedidas = express.Router();

routerMedidas.get('/ler', async (req, res) => {
  const id = req.query.id;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
  }
  if (!db) {
    return res.status(503).json({ error: 'Firestore não disponível' });
  }
  try {
    const docRef = db.collection('medidas').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Medida não encontrada' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (erro) {
    console.error('Erro ao ler medida:', erro);
    res.status(500).json({ error: 'Erro ao ler medida' });
  }
});
routerMedidas.get('/ler-todas', async (req, res) => {
  console.log('GET /ler-todas');
  if (!db) {
    return res.status(503).json({ error: 'Firestore não disponível' });
  }
  try {
    const snapshot = await db.collection('medidas').get();
    const medidas = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        peso: data.peso,
        idade: data.idade,
        createdAt: data.createdAt,
      };
    });
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
  const { id, ...payload } = req.body || {};
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({
      error: 'Campo id é obrigatório e deve ser uma string não vazia',
    });
  }
  if (!db) {
    return res.status(503).json({ error: 'Firestore não disponível' });
  }
  try {
    const docRef = db.collection('medidas').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Medida não encontrada' });
    }
    // eslint-disable-next-line no-unused-vars
    const { createdAt, ...camposAtualizaveis } = payload;
    await docRef.update(camposAtualizaveis);
    res.status(200).json({ id, message: 'Medida atualizada' });
  } catch (erro) {
    console.error('Erro ao atualizar medida:', erro);
    res.status(500).json({ error: 'Erro ao atualizar medida' });
  }
});
routerMedidas.delete('/remover', async (req, res) => {
  console.log('DELETE /remover');
});

export default routerMedidas;
