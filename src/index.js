import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4020;

app.get('/', (req, res) => {
  res.send('Hello .sssss..ddd..!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
