import express from 'express';
const app = express();
const port = 4020;

app.get('/', (req, res) => {
  res.send('Hello .sssss..ddd..!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
