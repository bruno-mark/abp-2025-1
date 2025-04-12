// Rota de recuperação de dados dos horários (Task #135)

// Realizar alteração do nome da tabela e nome das colunas 
// Estudar funcionalidade do codigo
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