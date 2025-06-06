module.exports = (app, db) => {
  //exporta o app, e o db

  app.get("/mapa/:sala", async (req, res) => {
  const { sala } = req.params;
  

  try {
    const nomeSala = `${sala}`; //Sala
    const resultado = await db.query(`
      SELECT
        h.id_horario,
        t.nome AS nome_turma,
        d.nome AS nome_disciplina,
        p.nome AS nome_professor,
        CASE h.dia_semana
            WHEN 1 THEN 'Segunda'
            WHEN 2 THEN 'Terça'
            WHEN 3 THEN 'Quarta'
            WHEN 4 THEN 'Quinta'
            WHEN 5 THEN 'Sexta'
            ELSE 'Desconhecido'
        END AS dia_semana,
        h.horario
      FROM horarios h
      JOIN turmas t ON h.id_turma = t.id_turma
      JOIN disciplinas d ON h.id_disciplina = d.id_disciplina
      JOIN professores p ON h.id_professor = p.id_professor
      JOIN salas s ON s.id_turma = t.id_turma
      WHERE s.nome = $1
      ORDER BY h.dia_semana, h.horario;
    `, [nomeSala]);

    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao buscar dados ❌", err);
    res.status(500).json({ Erro: "Erro interno no servidor" });
  }
});

};
