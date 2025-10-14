import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// exemplo básico
app.get('/', (req, res) => {
  res.send('Site HTTPS no ar 😎');
});

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/seu-dominio.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/seu-dominio.com/fullchain.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Servidor HTTPS rodando na porta 443 🔒');
});
