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
   async function inserirAmbiente(idHorario, idAlocacao, idAmbiente, diaSemana, horaInicio, horaFim) {
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
   inserirAmbiente(1, 1, 2, 'Segunda', '18:45', '19:35');
   inserirAmbiente(2, 2, 2, 'Segunda', '19:35', '20:25');
   inserirAmbiente(3, 3, 2, 'Segunda', '20:25', '21:15');
   inserirAmbiente(4, 4, 2, 'Segunda', '21:25', '22:15');
   inserirAmbiente(5, 5, 2, 'Segunda', '22:15', '23:05');
   inserirAmbiente(6, 6, 2, 'Terça', '18:45', '19:35');
   inserirAmbiente(7, 7, 2, 'Terça', '19:35', '20:25');
   inserirAmbiente(8, 8, 2, 'Terça', '20:25', '21:15');
   inserirAmbiente(9, 9, 2, 'Terça', '21:25', '22:15');
   inserirAmbiente(10, 10, 2, 'Terça', '22:15', '23:05');
   inserirAmbiente(11, 11, 2, 'Quarta', '18:45', '19:35');
   inserirAmbiente(12, 12, 2, 'Quarta', '19:35', '20:25');
   inserirAmbiente(13, 13, 2, 'Quarta', '20:25', '21:15');
   inserirAmbiente(14, 14, 2, 'Quarta', '21:25', '22:15');
   inserirAmbiente(15, 15, 2, 'Quarta', '22:15', '23:05');
   inserirAmbiente(16, 16, 2, 'Quinta', '18:45', '19:35');
   inserirAmbiente(17, 17, 2, 'Quinta', '19:35', '20:25');
   inserirAmbiente(18, 18, 2, 'Quinta', '20:25', '21:15');
   inserirAmbiente(19, 19, 2, 'Quinta', '21:25', '22:15');
   inserirAmbiente(20, 20, 2, 'Quinta', '21:25', '23:05');
   inserirAmbiente(21, 21, 2, 'Sexta', '18:45', '19:35');
   inserirAmbiente(22, 22, 2, 'Sexta', '19:35', '20:25');
   inserirAmbiente(23, 23, 2, 'Sexta', '20:25', '21:15');
   inserirAmbiente(24, 24, 2, 'Sexta', '21:25', '22:15');
   inserirAmbiente(25, 25, 2, 'Sexta', '21:25', '23:05');
   
   async function consultarAmbiente() {
    try{
        const res = await client.query(
        'SELECT * FROM horaio'
    );
    console.log('Horários:', res.rows);
    } 
    catch (err) {
        console.error('Erro ao buscar Horários:', err);
    }
   } 

   async function alterarIdHorarioAmbiente(idHorario, idHorario_novo) {
    try{
        const res = await client.query(
        'UPDATE horario SET id_horario = $ 1 WHERE id_horario = $2 RETURNING *',
        [idHorario_novo, idHorario]
    );
    console.log('Horário alterado:', res.rows[0]);
    } 
    catch (err) {
        console.error('Erro ao alterar Horário:', err);
    }
   } 

    async function alterarIdAlocacaoAmbiente(idAlocacao, idAlocacao_novo) {
     try{
          const res = await client.query(
          'UPDATE horario SET id_alocacao = $1 WHERE id_alocacao = $2 RETURNING *',
          [idAlocacao_novo, idAlocacao]
     );
     console.log('Horário alterado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao alterar Horário:', err);
     }
    }

    async function alterarIdAmbienteAmbiente(idAmbiente, idAmbiente_novo) {
     try{
          const res = await client.query(
          'UPDATE horario SET id_ambiente = $1 WHERE id_ambiente = $2 RETURNING *',
          [idAmbiente_novo, idAmbiente]
     );
     console.log('Horário alterado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao alterar Horário:', err);
     }
    }

    async function alterarDiaSemanaAmbiente(diaSemana, diaSemana_novo) {
     try{
          const res = await client.query(
          'UPDATE horario SET dia_semana = $1 WHERE dia_semana = $2 RETURNING *',
          [diaSemana_novo, diaSemana]
     );
     console.log('Horário alterado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao alterar Horário:', err);
     }
    }

    async function alterarHoraInicioAmbiente(horaInicio, horaInicio_novo) {
     try{
          const res = await client.query(
          'UPDATE horario SET hora_inicio = $1 WHERE hora_inicio = $2 RETURNING *',
          [horaInicio_novo, horaInicio]
     );
     console.log('Horário alterado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao alterar Horário:', err);
     }
    }

    async function alterarHoraFimAmbiente(horaFim, horaFim_novo) {
     try{
          const res = await client.query(
          'UPDATE horario SET hora_fim = $1 WHERE hora_fim = $2 RETURNING *',
          [horaFim_novo, horaFim]
     );
     console.log('Horário alterado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao alterar Horário:', err);
     }
    }

    async function deletarAmbiente(idHorario) {
     try{
          const res = await client.query(
          'DELETE FROM horario WHERE id_horario = $1 RETURNING *',
          [idHorario]
     );
     console.log('Horário deletado:', res.rows[0]);
     } 
     catch (err) {
          console.error('Erro ao deletar Horário:', err);
     }
    }