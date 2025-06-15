// Importa o framework Express para criar e gerenciar o servidor web
const express = require("express");
const dotenv = require("dotenv");

const { Pool } = require("pg");
const cors = require("cors");

dotenv.config();

// Cria uma instância do aplicativo Express
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json()); 

// Coneta ao banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, function () {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
  res.send('🚀 API rodando com sucesso e com deploy automático! hahahahaha');
});

require('./dataRecovery')(app, pool);
require('./rotasHorarios')(app, pool);
require('./csvUpload')(app, pool);
require('./mapa')(app, pool);
require('./scriptTabelaCadastro')(app, pool);
