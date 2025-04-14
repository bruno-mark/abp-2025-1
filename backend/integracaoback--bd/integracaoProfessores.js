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

async function inserirProfessores(id, nome, email) {
    try {
        const res = await client.query(
            'INSERT INTO professor (id_professor, nome_professor, email_professor) VALUES ($1, $2, $3) RETURNING *',
            [id, nome, email]
        );
        console.log("Professor inserido:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao inserir Professor:", err);
    }
}
inserirProfessores(1, "Arley Souza", "arley.souza@fatec.sp.gov.br");
inserirProfessores(2, "Antonio Egydio", "antonio.egydio@fatec.sp.gov.br");
inserirProfessores(3, "Marcelo Sudo", "marcelo.sudo@fatec.sp.gov.br" );
inserirProfessores(4, "Henrique", 'henrique@fatec.sp.gov.br');

async function consultarProfessores() {
    try {
        const res = await client.query(
            'SELECT * FROM professor',
        );
        console.log("Professores:", res.rows);
    } catch (err) {
        console.error("Erro ao buscar Professores:", err);
    }
}

async function alterarIdProfessores(id, id_novo) {
    try {
        const res = await client.query(
            'UPDATE professor SET id_professor = $2 WHERE id_professor = $1 RETURNING *',
            [id, id_novo]
        );
        console.log("Professor alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Professor:", err);
    }
}

async function alterarNomeProfessores(nome, nome_novo) {
    try {
        const res = await client.query(
            'UPDATE professor SET nome_professor = $2 WHERE nome_professor = $1 RETURNING *',
            [nome, nome_novo]
        );
        console.log("Professor alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Professor:", err);
    }
}

async function alterarEmailProfessores(email, email_novo) {
    try {
        const res = await client.query(
            'UPDATE professor SET email_professor = $2 WHERE email_professor = $1 RETURNING *',
            [email, email_novo]
        );
        console.log("Professor alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Professor:", err);
    }
}

async function deletarProfessores(id) {
    try {
        const res = await client.query(
            'DELETE FROM professor WHERE id_professor = $1 RETURNING *',
            [id]
        );
        console.log("Professor alterado:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao alterar Professor:", err);
    }
}