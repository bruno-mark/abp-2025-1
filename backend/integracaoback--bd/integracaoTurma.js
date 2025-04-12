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


async function inserirTurma(id, nome, nivel) {
    try{
        const res= await client.query(
            'INSERT INTO turma (id_turma, nome_turma, nivel) VALUES ($1, $2, $3) RETURNING *',
            [id, nome, nivel]
        );
        console.log('Turma inserida:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao inserir turma:', err);
    }
}
inserirTurma(1, 'DSM', 1);
inserirTurma(2, 'DSM', 2);
inserirTurma(3, 'DSM', 3);
inserirTurma(4, 'DSM', 4);
inserirTurma(5, 'DSM', 5);
inserirTurma(6, 'DSM', 6);
inserirTurma(7, 'Geo', 1);
inserirTurma(8, 'Geo', 2);
inserirTurma(9, 'Geo', 3);
inserirTurma(10, 'Geo', 4);
inserirTurma(11, 'Geo', 5);
inserirTurma(12, 'Geo', 6);
inserirTurma(13, 'MA', 1);
inserirTurma(14, 'MA', 2);
inserirTurma(15, 'MA', 3);
inserirTurma(16, 'MA', 4);
inserirTurma(17, 'MA', 5);
inserirTurma(18, 'MA', 6);