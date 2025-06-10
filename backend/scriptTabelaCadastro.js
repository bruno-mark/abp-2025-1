module.exports = (app, db) => {
// Exporta o app e o bd

<<<<<<< HEAD
app.get('/scriptTabelaCadastro/:curso/:periodo/:semestre', async (req, res) => {
=======
app.get('/tabelaCadastro/:curso/:periodo/:semestre', async (req, res) => {
>>>>>>> ce5bd5d5cb386efd9fbddc6bae99c8979323efc7
    const { curso, periodo, semestre } = req.params;

    try {
        const nomeTurma = `${curso}-${semestre}-${periodo}`;
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
<<<<<<< HEAD
            JOIN disciplinas d ON h.id_disciplina = d.id_disciplina
=======
            JOIN disciplinas d ON h.id_disciplinas = d.id_disciplina
>>>>>>> ce5bd5d5cb386efd9fbddc6bae99c8979323efc7
            JOIN professores p ON h.id_professor = p.id_professor
            WHERE t.nome = $1
            ORDER BY h.dia_semana, h.horario;
        `, [nomeTurma]);

        res.json(resultado.rows);
        } catch (err) {
            console.error('Erro ao buscar dados ❌', err);
            res.status(500).json({Erro: 'Erro interno no servidor' });
        }
    });

  app.post('/scriptTabelaCadastro/insert', async (req, res) => {
    try {
        const dados = req.body;

        if (!Array.isArray(dados)) {
            return res.status(400).send("Erro: corpo deve ser um array");
        }

      // Função auxiliar para mapear dias da semana
      const diaSemanaMap = {
        'Segunda': 1,
        'Terça': 2,
        'Quarta': 3,
        'Quinta': 4,
        'Sexta': 5,
      };

      for (const linha of dados) {
        const diaSemanaNumero = diaSemanaMap[linha.dia_semana] || null;

        if (!diaSemanaNumero) {
          console.warn(`Dia da semana inválido: ${linha.dia_semana}`);
          continue;
        }

        // Busca os IDs necessários
        const resultTurma = await db.query(`SELECT id_turma FROM turmas WHERE nome = $1`, [linha.nome_turma]);
        const resultDisciplina = await db.query(`SELECT id_disciplina FROM disciplinas WHERE nome = $1`, [linha.nome_disciplina]);
        const resultProfessor = await db.query(`SELECT id_professor FROM professores WHERE nome = $1`, [linha.nome_professor]);

        if (
          resultTurma.rowCount === 0 ||
          resultDisciplina.rowCount === 0 ||
          resultProfessor.rowCount === 0
        ) {
          console.warn(`Dados não encontrados para linha: ${JSON.stringify(linha)}`);
          continue;
        }

        const idTurma = resultTurma.rows[0].id_turma;
        const idDisciplina = resultDisciplina.rows[0].id_disciplina;
        const idProfessor = resultProfessor.rows[0].id_professor;

        // UPSERT
        await db.query(
          `
          INSERT INTO horarios (horario, dia_semana, id_turma, id_disciplina, id_professor)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (horario, dia_semana, id_turma)
          DO UPDATE SET id_disciplina = EXCLUDED.id_disciplina, id_professor = EXCLUDED.id_professor;
          `,
          [linha.horario, diaSemanaNumero, idTurma, idDisciplina, idProfessor]
        );
      }

      res.send('Dados inseridos/atualizados com sucesso ✅');
    } catch (err) {
      console.error('Erro ao inserir/atualizar dados ❌', err);
      res.status(500).send('Erro ao inserir/atualizar dados');
    }
  });
};