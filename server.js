import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// pegar o diretório atual certinho (por causa do import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve os arquivos da pasta dist (o build do Vite)
app.use(express.static(path.join(__dirname, "dist")));

// qualquer rota que não exista volta pro index.html (pra funcionar com React Router)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const PORT = 80; // pode trocar pra 443 depois se for HTTPS
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
