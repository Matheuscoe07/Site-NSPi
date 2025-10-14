import http from 'http';
import express from 'express';

const app = express();

// exemplo básico
app.get('/', (req, res) => {
  res.send('Site HTTP no ar 🚀');
});

// cria o servidor HTTP
http.createServer(app).listen(80, () => {
  console.log('Servidor HTTP rodando na porta 80 🌐');
});
