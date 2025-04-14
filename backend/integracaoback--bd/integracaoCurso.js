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

async function inserirCurso(id, nome) {
    try {
        const res = await client.query(
            'INSERT INTO curso (id_curso, nome_curso) VALUES ($1, $2) RETURNING *',
            [id, nome]
        );
        console.log("Curso Inserido:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao inserir Curso:", err);
    }
}
inserirCurso(1, 'DSM');
inserirCurso(2,'Geoprocessamento Matutino');
inserirCurso(3, 'Meio ambiente Noturno');

async function consultarCurso() {
    try {
        const res = await client.query(
            'SELECT * FROM curso'
        );
        console.log("Cursos:", res.rows);
    } catch (err) {
        console.error("Erro ao buscar Cursos:", err);
    }
}

async function alterarIdCurso(id, id_novo) {
    try {
        const res = await client.query(
            'UPDATE curso SET id_curso = $1 WHERE id = $2 RETURNING *',
            [id, id_novo]
        );
        console.log("Curso alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Curso:", err);
    }
}

async function alterarNomeCurso(nome, nome_novo) {
    try {
        const res = await client.query(
            'UPDADTE curso  SET  nome_curso = $1 WHERE nome_curso $2 RETURNING *',
            [id, nome]
        );
        console.log("Curso alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Curso:", err);
    }
}

async function deletarCurso(id, nome) {
    try {
        const res = await client.query(
            'DELETE FROM curso WHERE id_curso = $1 RETURNING *',
            [id, nome]
        );
        console.log("Curso excluido:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao excluir Curso:", err);
    }
}