import express from 'express';
import { db } from '../config/firebase.js';
import { validarEExecutar } from '../helpers/validacao.js';
import {
  schemaMedidaAtualizar,
  schemaMedidaCriar,
  schemaQueryIdMedida,
} from '../schemas/medidas.js';
import { normalizarQueryId } from '../utils/normalizarQuery.js';

const routerMedidas = express.Router();

routerMedidas.get(
  '/ler',
  validarEExecutar({
    schema: schemaQueryIdMedida,
    obterDados: (req) => normalizarQueryId(req.query),
    executar: async (data, req, res) => {
      const { id } = data;
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
    },
  })
);

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

routerMedidas.post(
  '/criar',
  validarEExecutar({
    schema: schemaMedidaCriar,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('POST /criar');
      if (!db) {
        return res.status(503).json({ error: 'Firestore não disponível' });
      }
      try {
        const ref = await db.collection('medidas').add({
          ...data,
          createdAt: new Date(),
        });
        res.status(201).json({ id: ref.id, message: 'Medida criada' });
      } catch (erro) {
        console.error('Erro ao criar medida:', erro);
        res.status(500).json({ error: 'Erro ao criar medida' });
      }
    },
  })
);

routerMedidas.put(
  '/atualizar',
  validarEExecutar({
    schema: schemaMedidaAtualizar,
    obterDados: (req) => req.body ?? {},
    executar: async (data, req, res) => {
      console.log('PUT /atualizar');
      const { id, ...rest } = data;
      const camposAtualizaveis = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined)
      );
      if (Object.keys(camposAtualizaveis).length === 0) {
        return res.status(400).json({
          error: 'Informe ao menos um campo numérico para atualizar além do id',
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
        await docRef.update(camposAtualizaveis);
        res.status(200).json({ id, message: 'Medida atualizada' });
      } catch (erro) {
        console.error('Erro ao atualizar medida:', erro);
        res.status(500).json({ error: 'Erro ao atualizar medida' });
      }
    },
  })
);

routerMedidas.delete(
  '/remover',
  validarEExecutar({
    schema: schemaQueryIdMedida,
    obterDados: (req) => normalizarQueryId(req.query),
    executar: async (data, req, res) => {
      const { id } = data;
      if (!db) {
        return res.status(503).json({ error: 'Firestore não disponível' });
      }
      try {
        const docRef = db.collection('medidas').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
          return res.status(404).json({ error: 'Medida não encontrada' });
        }
        await docRef.delete();
        res.status(200).json({ id, message: 'Medida removida' });
      } catch (erro) {
        console.error('Erro ao remover medida:', erro);
        res.status(500).json({ error: 'Erro ao remover medida' });
      }
    },
  })
);

export default routerMedidas;
