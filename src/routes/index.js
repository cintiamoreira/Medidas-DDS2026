import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running', version: '1.0' });
});

router.get('/itens', (req, res) => {
  res.json({ itens: [] });
});

export default router;
