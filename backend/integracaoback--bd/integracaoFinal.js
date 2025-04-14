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



async function inserirDisciplina_turma(id, disciplina) {
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



   //ambiente entende-se por andar do prédio da faculdade
   async function inserirHorario(idHorario, idAlocacao, idAmbiente, diaSemana, horaInicio, horaFim) {
    try{
        const res = await client.query(
        'INSERT INTO horario (id_horario, id_alocacao, id_ambiente, dia_semana, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [idHorario, idAlocacao, idAmbiente, diaSemana, horaInicio, horaFim]
    );
    console.log('Horário inserido:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao inserir Horário:', err);
    }
   } 
   inserirHorario(1, 1, 2, 'Segunda', '18:45', '19:35');
   inserirHorario(2, 2, 2, 'Segunda', '19:35', '20:25');
   inserirHorario(3, 3, 2, 'Segunda', '20:25', '21:15');
   inserirHorario(4, 4, 2, 'Segunda', '21:25', '22:15');
   inserirHorario(5, 5, 2, 'Segunda', '22:15', '23:05');
   inserirHorario(6, 6, 2, 'Terça', '18:45', '19:35');
   inserirHorario(7, 7, 2, 'Terça', '19:35', '20:25');
   inserirHorario(8, 8, 2, 'Terça', '20:25', '21:15');
   inserirHorario(9, 9, 2, 'Terça', '21:25', '22:15');
   inserirHorario(10, 10, 2, 'Terça', '22:15', '23:05');
   inserirHorario(11, 11, 2, 'Quarta', '18:45', '19:35');
   inserirHorario(12, 12, 2, 'Quarta', '19:35', '20:25');
   inserirHorario(13, 13, 2, 'Quarta', '20:25', '21:15');
   inserirHorario(14, 14, 2, 'Quarta', '21:25', '22:15');
   inserirHorario(15, 15, 2, 'Quarta', '22:15', '23:05');
   inserirHorario(16, 16, 2, 'Quinta', '18:45', '19:35');
   inserirHorario(17, 17, 2, 'Quinta', '19:35', '20:25');
   inserirHorario(18, 18, 2, 'Quinta', '20:25', '21:15');
   inserirHorario(19, 19, 2, 'Quinta', '21:25', '22:15');
   inserirHorario(20, 20, 2, 'Quinta', '21:25', '23:05');
   inserirHorario(21, 21, 2, 'Sexta', '18:45', '19:35');
   inserirHorario(22, 22, 2, 'Sexta', '19:35', '20:25');
   inserirHorario(23, 23, 2, 'Sexta', '20:25', '21:15');
   inserirHorario(24, 24, 2, 'Sexta', '21:25', '22:15');
   inserirHorario(25, 25, 2, 'Sexta', '21:25', '23:05');


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
   

   