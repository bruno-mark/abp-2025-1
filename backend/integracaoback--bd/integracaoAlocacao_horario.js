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
   async function inserirAlocacao_horario(idAlocacao, idProfessor) {
    try{
        const res = await client.query(
        'INSERT INTO alocacao_horario (id_alocacao, id_professor) VALUES ($1, $2) RETURNING *',
        [idAlocacao, idProfessor]
    );
    console.log('Alocação de horario inserida:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao inserir alocação de horário:', err);
    }
   } 
   inserirAlocacao_horario(1, 2);
   inserirAlocacao_horario(2, 2);
   inserirAlocacao_horario(3, 2);
   inserirAlocacao_horario(4, 2);
   inserirAlocacao_horario(5, 2);
   inserirAlocacao_horario(6, 3);
   inserirAlocacao_horario(7, 3);
   inserirAlocacao_horario(8, 3);
   inserirAlocacao_horario(9, 3);
   inserirAlocacao_horario(10, 3);
   inserirAlocacao_horario(11, 1);
   inserirAlocacao_horario(12, 1);
   inserirAlocacao_horario(13, 1);
   inserirAlocacao_horario(14, 1);
   inserirAlocacao_horario(15, 1);
   inserirAlocacao_horario(16, 2);
   inserirAlocacao_horario(17, 2);
   inserirAlocacao_horario(18, 2);
   inserirAlocacao_horario(19, 3);
   inserirAlocacao_horario(20, 3);
   inserirAlocacao_horario(21, 4);
   inserirAlocacao_horario(22, 4);
   inserirAlocacao_horario(23, 4);
   inserirAlocacao_horario(24, 4);
   inserirAlocacao_horario(25, 4);
   
   async function consultarAlocacao_horario() {
    try{
        const res = await client.query(
        'SELECT * FROM alocacao_horario'
    );
    console.log('Alocações de horario:', res.rows);
    } 
    catch (err) {
        console.error('Erro ao buscar alocação de horário:', err);
    }
   } 

   consultarAlocacao_horario();

   async function alterarIdAlocacao_horario(idAlocacao, idAlocacaoNovo) {
    try{
        const res = await client.query(
            'UPDATE alocacao_horario SET id_alocacao = $2 WHERE id_alocacao = $1 RETURNING *',
        [idAlocacao, idAlocacaoNovo]


    );
    console.log('Alocação de horario alterada:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar alocação de horário:', err);
    }
   }

   async function alterarIdProfessorAlocacao_horario(idProfessor, idProfessorNovo) {
    try{
        const res = await client.query(
            'UPDATE alocacao_horario SET id_professor = $4 WHERE id_alocacao = $1 AND id_professor = $2 RETURNING *',
        [idProfessor, idProfessorNovo]


    );
    console.log('Alocação de horario alterada:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar alocação de horário:', err);
    }
   }

   //alterarAlocacao_horario(1, 2, 3, 4);

   async function deletarAlocacao_horario(idAlocacao) {
    try{
        const res = await client.query(
            'DELETE FROM alocacao_horario WHERE idAlocacao = $1 RETURNING *',
        [idAlocacao]


    );
    console.log('Alocação de horario inserida:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao inserir alocação de horário:', err);
    }
   }

    //deletarAlocacao_horario(1);