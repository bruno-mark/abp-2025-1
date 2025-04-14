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

   async function consultarAmbiente() {
    try{
        const res = await client.query(
        'SELECT * FROM turma_professor'
    );
    console.log('Turma_professor:', res.rows);
    } 
    catch (err) {
        console.error('Erro ao inserir turma_professor:', err);
    }
    }

    async function alterarIdTurmaAmbiente(idTurma, idTurmaNovo) {
        try{
            const res = await client.query(
            'UPDATE turma_professor SET id_turma = $1 WHERE id_turma = $2 RETURNING *',
            [idTurmaNovo, idTurma]
        );
        console.log('Turma_professor alterado:', res.rows[0]);
        } 
        catch (err) {
            console.error('Erro ao alterar turma_professor:', err);
        }
    }

    async function alterarIdProfessorAmbiente(idProfessor, idProfessorNovo) {
        try{
            const res = await client.query(
            'UPDATE turma_professor SET id_professor = $1 WHERE id_professor = $2 RETURNING *',
            [idProfessorNovo, idProfessor]
        );
        console.log('Turma_professor alterado:', res.rows[0]);
        } 
        catch (err) {
            console.error('Erro ao alterar turma_professor:', err);
        }
    }

    async function deletarAmbiente(idTurma) {
        try{
            const res = await client.query(
            'DELETE FROM turma_professor WHERE id_turma = $1 RETURNING *',
            [idTurma]
        );
        console.log('Turma_professor deletado:', res.rows[0]);
        } 
        catch (err) {
            console.error('Erro ao deletar turma_professor:', err);
        }
    }