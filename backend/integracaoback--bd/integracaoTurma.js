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

async function consultarTurma() {
    try{
        const res= await client.query(
            'SELECT * FROM turma'
        );
        console.log('Turmas:', res.rows);
    } catch (err) {
        console.error('Erro ao buscar turma:', err);
    }
}

async function alterarIdTurma(id, id_novo) {
    try{
        const res= await client.query(
            'UPDATE turma SET id_turma $1 WHERE id_turma = $2 RETURNING *',
            [id_novo, id]
        );
        console.log('Turma alterada:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao alterar turma:', err);
    }
}

async function alterarNomeTurma(nome, nome_novo) {
    try{
        const res= await client.query(
            'UPDATE turma SET nome_turma $1 WHERE nome_turma = $2 RETURNING *',
            [nome_novo, nome]
        );
        console.log('Turma alterada:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao alterar turma:', err);
    }
}

async function alterarNivelTurma(nivel, nivel_novo) {
    try{
        const res= await client.query(
            'UPDATE turma SET nivel $1 WHERE nivel = $2 RETURNING *',
            [nivel_novo, nivel]
        );
        console.log('Turma alterada:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao alterar turma:', err);
    }
}

async function deletarTurma(id) {
    try{
        const res= await client.query(
            'DELETE turma WHERE id_turma = $1 RETURNING *',
            [id]
        );
        console.log('Turma deletada:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao deletar turma:', err);
    }
}