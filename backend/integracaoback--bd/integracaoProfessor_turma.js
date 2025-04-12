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



async function inserirAmbiente(idTurma, idProfessor) {
    try{
        const res = await client.query(
        'INSERT INTO turma_professor (id_turma, id_professor) VALUES ($1, $2) RETURNING *',
        [idTurma, idProfessor]
    );
    console.log('Turma_professor inserido:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao inserir turma_professor:', err);
    }
   } 
   inserirAmbiente(1, 1);
   inserirAmbiente(1, 2);
   inserirAmbiente(1, 3);
   inserirAmbiente(1, 4);