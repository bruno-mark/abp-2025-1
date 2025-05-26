// csvUpload.js corrigido
const express = require("express");

module.exports = (app, db) => {
  app.use(express.json());

  app.post("/api/inserir-csv", async (req, res) => {
    const dados = req.body;

    try {
      for (const linha of dados) {
        const {
          nome_turma,
          nome_disciplina,
          nome_professor,
          dia_semana,
          horario,
        } = linha;

        const periodo = nome_turma[nome_turma.length - 1].toUpperCase();
        const numero = parseInt(nome_turma.split("-")[1]);

        // 1. Curso fixo (ex: "DSM")

        const cursoNome = nome_turma.split("-")[0];
        console.log("🔧 Inserindo curso:", cursoNome);
        const curso = await db.query(
          `INSERT INTO cursos (nome)
           VALUES ($1)
           ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome
           RETURNING id_curso`,
          [cursoNome]
        );

        const id_curso = curso.rows[0].id_curso;

        // 2. Semestre
        console.log("🔧 Inserindo semestre:", { numero, periodo, id_curso });

        const semestre = await db.query(
          `INSERT INTO semestres (numero, periodo, id_curso)
           VALUES ($1, $2, $3)
           ON CONFLICT (numero, periodo, id_curso)
           DO NOTHING
           RETURNING id_semestre`,
          [numero, periodo, id_curso]
        );

        const id_semestre =
          semestre.rows[0]?.id_semestre ||
          (
            await db.query(
              `SELECT id_semestre FROM semestres WHERE numero=$1 AND periodo=$2 AND id_curso=$3`,
              [numero, periodo, id_curso]
            )
          ).rows[0].id_semestre;

        // 3. Turma
        console.log("🔧 Inserindo turma:", {
          nome_turma,
          id_curso,
          id_semestre,
        });

        const turma = await db.query(
          `INSERT INTO turmas (nome, id_curso, id_semestre)
           VALUES ($1, $2, $3)
           ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome
           RETURNING id_turma`,
          [nome_turma.toUpperCase(), id_curso, id_semestre]
        );
        const id_turma = turma.rows[0].id_turma;

        // 4. Disciplina
        console.log("🔧 Inserindo disciplina:", nome_disciplina);

        const disciplina = await db.query(
          `INSERT INTO disciplinas (nome, carga_horaria)
           VALUES ($1, 80)  -- exemplo de carga horária
           ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome
           RETURNING id_disciplina`,
          [nome_disciplina]
        );
        const id_disciplina = disciplina.rows[0].id_disciplina;

        // 5. Professor
        console.log("🔧 Inserindo professor:", nome_professor);

        const professor = await db.query(
          `INSERT INTO professores (nome)
           VALUES ($1)
           ON CONFLICT (nome) DO UPDATE SET nome = EXCLUDED.nome
           RETURNING id_professor`,
          [nome_professor]
        );
        const id_professor = professor.rows[0].id_professor;

        // 6. Inserir na tabela de horários (corrigido com conflito baseado em UNIQUE existente)
        console.log("💾 Inserindo horário com:", {
          id_turma,
          id_disciplina,
          id_professor,
          dia_semana: Number(dia_semana),
          horario: String(horario),
        });

        await db.query(
  `INSERT INTO horarios (id_turma, id_disciplina, id_professor, dia_semana, horario)
   VALUES ($1, $2, $3, $4, $5)
   ON CONFLICT ON CONSTRAINT unique_horario_completo DO NOTHING`,
  [id_turma, id_disciplina, id_professor, Number(dia_semana), String(horario)]
);

      }

      res.status(200).json({ mensagem: "✅ Dados inseridos com sucesso!" });
    } catch (erro) {
      console.error("❌ Erro ao inserir dados:", erro);
      res.status(500).json({ erro: "Erro ao inserir os dados" });
    }
  });
};
