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

async function inserirDisciplina(id, curso, disciplina) {
    try{
        const res= await client.query(
            'INSERT INTO disciplina (id_disciplina, id_curso, nome_disciplina) VALUES ($1, $2, $3) RETURNING *',
            [id, curso, disciplina]
        );
        console.log('Disciplina inserida:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao inserir disciplina:', err);
    }
}
inserirDisciplina(1, 1, 'Algoritmo e Lógica de programação');
inserirDisciplina(2, 1, 'Desenvolvimento Web');
inserirDisciplina(3, 1, 'Engenharia de Software');
inserirDisciplina(4, 1, 'Sistemas Operacionais');
inserirDisciplina(5, 1, 'Design Digital');
inserirDisciplina(6, 1, 'Modelgem de BD');
inserirDisciplina(7, 2, 'Introdução à Ciência da Geoinformação');
inserirDisciplina(8, 2, ' Algoritmos e Lógica de Programação');
inserirDisciplina(9, 2, 'Metodologia');
inserirDisciplina(10, 2, 'Desenho Técnico');
inserirDisciplina(11, 2, 'Comunicação');
inserirDisciplina(12, 2, 'Inglês I');
inserirDisciplina(13, 2, 'Fundamentos de Física');
inserirDisciplina(14, 2, 'Cálculo');
inserirDisciplina(15, 3, 'Ciências Ambientais e das Águas');
inserirDisciplina(17, 3, 'Inglês I');
inserirDisciplina(18, 3, 'Fund. Comunicação Empresarial');
inserirDisciplina(19, 3, 'Química Geral');
inserirDisciplina(20, 3, 'Metodologia');
inserirDisciplina(21, 3, 'Sociologia Ambiental');
inserirDisciplina(22, 3, 'Biologia');
inserirDisciplina(23, 3, 'Matemática Aplicada');
inserirDisciplina(24, 3, 'Geociência Ambiental');
