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

// Coneta ao banco de dados PostgreSQL
const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
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
require('./mapa')(app, db);
//require('./csvInsertion')(app, db);
//require('./scriptTabelaCadastro.js')(app, bd);
