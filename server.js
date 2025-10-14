const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Site HTTP no ar 🚀');
});

http.createServer(app).listen(80, () => {
  console.log('Servidor HTTP rodando na porta 80 🌐');
});
