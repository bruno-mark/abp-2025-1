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

    async function inserirDisciplina_turma(id, turma) {
        try{
            const res= await client.query(
                'INSERT INTO disciplina_turma (id_disciplina, id_turma) VALUES ($1, $2) RETURNING *',
                [id, disciplina]
            );
            console.log('Disciplina inserida:', res.rows[0]);
        } catch (err) {
            console.error('Erro ao inserir disciplina:', err);
        }
    }
    inserirDisciplina_turma(1, 1);
    inserirDisciplina_turma(2, 1);
    inserirDisciplina_turma(3, 1); 
    inserirDisciplina_turma(4, 1);
    inserirDisciplina_turma(5, 1);
    inserirDisciplina_turma(6, 1);
    inserirDisciplina_turma(7, 2);
    inserirDisciplina_turma(8, 2);
    inserirDisciplina_turma(9, 2);
    inserirDisciplina_turma(10, 2);
    inserirDisciplina_turma(11, 2);
    inserirDisciplina_turma(12, 2);
    inserirDisciplina_turma(13, 2);
    inserirDisciplina_turma(14, 2);
    inserirDisciplina_turma(15, 3);
    inserirDisciplina_turma(16, 3);
    inserirDisciplina_turma(17, 3);
    inserirDisciplina_turma(18, 3);
    inserirDisciplina_turma(19, 3);
    inserirDisciplina_turma(20, 3);
    inserirDisciplina_turma(21, 3);
    inserirDisciplina_turma(22, 3);
    inserirDisciplina_turma(23, 3);
    inserirDisciplina_turma(24, 3);

    async function consultaDisciplina_turma() {
        try{
            const res= await client.query(
                'SELECT * FROM disciplina_turma'
                
            );
            console.log('Disciplinas:', res.rows);
        } catch (err) {
            console.error('Erro ao inserir disciplina:', err);
        }
    }

    async function alterarIdDisciplina_turma(id, id_novo) {
        try{
            const res= await client.query(
                'UPDATE disciplina_turma SET id_turma = $2 WHERE id_turma = $1 RETURNING *',
                [id, id_novo]
            );
            console.log('Disciplina alterada:', res.rows[0]);
        } catch (err) {
            console.error('Erro ao alterar disciplina:', err);
        }
    }

    async function alterarDisciplinaDisciplina_turma(disciplina, disciplina_novo) {
        try{
            const res= await client.query(
                'UPDATE disciplina_turma SET id_disciplina = $1 WHERE id_disciplina = $2 RETURNING *',
                [disciplina_novo, disciplina]
            );
            console.log('Disciplina alterada:', res.rows[0]);
        } catch (err) {
            console.error('Erro ao alterar disciplina:', err);
        }
    }

    async function consultaDisciplina_turma(id) {
        try{
            const res= await client.query(
                'DELET FROM disciplina_turma WHERE id_turma = $1 RETURNING *',
                [id]
                
            );
            console.log('Disciplinas:', res.rows);
        } catch (err) {
            console.error('Erro ao inserir disciplina:', err);
        }
    }