// importa a biblioteca pg
const {Client} = require('pg')

// configurando o banco de dados
const client = new Client({
    user: "postgres" ,
    host: "localhost" ,
    database: "teste" ,
    password: "1234" ,
    port: 5432
});

// conectar ao banco de dados
client.connect()
    .then(()=>console.log('✅Conectado ao postgreSQL'))
    .catch(err=>console.log('Erro ao conectar:', err.stack));
    // Fechar a conexão ao finalizar
    // client.end();

//ambiente entende-se por andar do prédio da faculdade
   async function inserirAmbiente(id, nome, capacidade) {
    try{
        const res = await client.query(
        'INSERT INTO ambiente (id_ambiente, nome_ambiente, capacidade) VALUES ($1, $2, $3) RETURNING *',
        [id, nome, capacidade]
    );
    console.log('Ambiente inserido:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao inserir ambiente:', err);
    }
   } 
   inserirAmbiente(1, 'Térreo', 100);
   inserirAmbiente(2, '1º Andar', 50);
   inserirAmbiente(3, '2º Andar', 100);

   async function consultarAmbiente() {
    try{
        const res = await client.query(
        'SELECT * FROM ambiente'
    );
    console.log('AmbienteS:', res.rows);
    } 
    catch (err) {
        console.error('Erro ao bucsar ambientes:', err);
    }
   } 
   consultarAmbiente();

   async function alterarIdAmbiente(id, id_novo) {
    try{
        const res = await client.query(
        'UPDATE ambiente SET id_ambiente = $1, WHERE id_ambiente = $2 RETURNING *',
        [id_novo, id]
    );
    console.log('Ambiente alterado:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar id_ambiente:', err);
    }
   } 

   async function alterarNomeAmbiente(nome, nome_novo) {
    try{
        const res = await client.query(
        'UPDATE ambiente SET nome_ambiente = $1 nome_ambiente = $2 RETURNING *',
        [nome_novo, nome]
    );
    console.log('Ambiente alterado:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar nome_ambiente:', err);
    }
   } 

   async function alterarCapacidadeAmbiente(capacidade, capacidade_novo) {
    try{
        const res = await client.query(
        'UPDATE ambiente SET capacidade = $1 capacidade = $2 RETURNING *',
        [capacidade_novo, capacidade]
    );
    console.log('Ambiente alterado:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar ambiente:', err);
    }
   } 

   async function deletarAmbiente(id) {
    try{
        const res = await client.query(
        'DELETE FROM ambiente WHERE id_ambiente = $1 RETURNING *',
        [id]
    );
    console.log('Ambiente deletado:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao deletar ambiente:', err);
    }
   } 