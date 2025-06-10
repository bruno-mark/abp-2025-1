// Importa o framework Express para criar e gerenciar o servidor web
const express = require("express");
const dotenv = require("dotenv");

const { Client } = require("pg");
const cors = require("cors");



dotenv.config();

// Cria uma instância do aplicativo Express
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json()); 

// Coneta ao banco de dados PostgreSQL
const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL');
    console.log(`📡 Host: ${process.env.DB_HOST}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME}`);
    console.log(`🔌 PostgreSQL Port: ${process.env.DB_PORT}`);
  })
  .catch(err => console.error('❌ Erro ao conectar:', err));

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, function () {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
  res.send('🚀 API rodando com sucesso e com deploy automático! hahahahaha');
});

require('./dataRecovery')(app, db);
require('./rotasHorarios')(app, db);
require('./csvUpload')(app, db);
require('./mapa')(app, db);
require('./csvInsertion')(app, db);
require('./scriptTabelaCadastro')(app, db);
