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
