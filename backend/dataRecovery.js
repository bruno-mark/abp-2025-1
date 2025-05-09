// Rota de recuperação de dados dos horários (Task #135)

// Realizar alteração do nome da tabela e nome das colunas 
// Estudar funcionalidade do codigo
module.exports = (app, db) => {
app.get('/horarios', async (req, res) => {
    try {
      const query = `
        SELECT 
          h.id_horario,
          h.dia_semana,
          h.hora_inicio,
          h.hora_fim,
          a.nome_ambiente,
          p.nome_professor,
          p.email_professor
        FROM Horario h
        JOIN Ambiente a ON h.id_ambiente = a.id_ambiente
        JOIN Alocacao_Horario ah ON h.id_alocacao = ah.id_alocacao
        JOIN Professor p ON ah.id_professor = p.id_professor
      `;
  
      const result = await db.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error('❌ Erro ao recuperar dados:', err);
      res.status(500).json({ erro: 'Erro ao recuperar dados do banco' });
    }
  });
}


module.exports = (app, db) => {                      //exporta o app, e o db
  app.get("/horarios", async (req, res) => {         //cria a rota GET para o /horarios, e cria a função async(assincrona)
    const {curso, periodo, semestre} = req.query;    //

    //tenta executar a consulta com o db.query, o await é necessário por ser uma operação assíncrona
    try {
      const resultado = await db.query(
        //consulta os dados da tabela horario usando o select * from e coloca os dados nos parametros dentro do []
        `SELECT * FROM horarios WHERE cursos = $1 AND periodo = $2 AND semestre = $3`,  //ou então: SELECT * FROM horarios WHERE ($1, $2, $3)
         [curso, periodo, semestre]
      );
      //manda o resultado em json
 res.json(resultado.rows);
    } catch (err) {     // caso não funcione ele mostra o erro coma mensagem e o tipo de erro(500)
      console.error("Erro ao buscar dados ❌", err );
      res.status(500).json({Erro: "Erro interno no servidor"});
    }
  });
};



