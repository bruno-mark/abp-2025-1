const dropArea = document.querySelector(".insercao__drop-area");
const fileInput = document.getElementById("file-upload");

dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#4a8b92";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "#5B9EA6";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#5B9EA6";
  fileInput.files = e.dataTransfer.files;
});


// 
const multer    = require('multer');
const { parse } = require('csv-parse');
const upload    = multer({ storage: multer.memoryStorage() });

module.exports = (app, db) => {
  // Rota de importação
  app.post('/import/horarios', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo recebido' });

    const lines = [];
    const parser = parse(req.file.buffer, { columns: true, trim: true });

    parser.on('readable', () => {
      let record;
      while (record = parser.read()) {
        lines.push(record);
      }
    });

    parser.on('error', err => {
      console.error(err);
      return res.status(400).json({ erro: 'Falha ao ler CSV', detalhes: err.message });
    });

    parser.on('end', async () => {
      const erros = [];
      let sucesso = 0;

      // Inicia transação
      const client = await db.connect();
      try {
        await client.query('BEGIN');

        for (let [i,row] of lines.entries()) {
          const { curso, semestre_num, semestre_periodo, turma, disciplina, carga, professor, sala, andar, dia_semana, horario } = row;
          const linha = i+2; // para mensagem (cabeçalho=1)

          // Valida campos obrigatórios
          if (![curso, semestre_num, semestre_periodo, turma, disciplina, professor, sala, dia_semana, horario].every(Boolean)) {
            erros.push({ linha, motivo: 'Campo obrigatório faltando' });
            continue;
          }

          // 1) cursos
          const r1 = await client.query(
            `INSERT INTO cursos(nome) VALUES($1) ON CONFLICT (nome) DO UPDATE SET nome=EXCLUDED.nome RETURNING id_curso`,
            [curso]
          );
          const id_curso = r1.rows[0].id_curso;

          // 2) semestres
          const r2 = await client.query(
            `INSERT INTO semestres(numero, periodo, id_curso) 
             VALUES($1,$2,$3) 
             ON CONFLICT (numero,periodo,id_curso) DO UPDATE SET numero=EXCLUDED.numero 
             RETURNING id_semestre`,
            [parseInt(semestre_num), semestre_periodo, id_curso]
          );
          const id_semestre = r2.rows[0].id_semestre;

          // 3) turmas
          const r3 = await client.query(
            `INSERT INTO turmas(nome, id_curso, id_semestre) 
             VALUES($1,$2,$3) 
             ON CONFLICT (nome) DO UPDATE SET nome=EXCLUDED.nome 
             RETURNING id_turma`,
            [turma, id_curso, id_semestre]
          );
          const id_turma = r3.rows[0].id_turma;

          // 4) disciplinas
          const r4 = await client.query(
            `INSERT INTO disciplinas(nome, carga_horaria) 
             VALUES($1,$2) 
             ON CONFLICT (nome) DO UPDATE SET carga_horaria=EXCLUDED.carga_horaria 
             RETURNING id_disciplina`,
            [disciplina, parseInt(carga)]
          );
          const id_disciplina = r4.rows[0].id_disciplina;

          // 5) professores
          const r5 = await client.query(
            `INSERT INTO professores(nome) 
             VALUES($1) 
             ON CONFLICT (nome) DO UPDATE SET nome=EXCLUDED.nome 
             RETURNING id_professor`,
            [professor]
          );
          const id_professor = r5.rows[0].id_professor;

          // 6) andares e salas (se existir tabela)
          const rAndar = await client.query(
            `INSERT INTO andares(numero) VALUES($1)
             ON CONFLICT (numero) DO UPDATE SET numero=EXCLUDED.numero RETURNING id_andar`,
            [parseInt(andar)]
          );
          const id_andar = rAndar.rows[0].id_andar;

          const rSala = await client.query(
            `INSERT INTO salas(nome, id_andar) VALUES($1,$2)
             ON CONFLICT (nome) DO UPDATE SET id_andar=EXCLUDED.id_andar RETURNING id_sala`,
            [sala, id_andar]
          );
          const id_sala = rSala.rows[0].id_sala;

          // 7) vínculo turma–disciplina
          await client.query(
            `INSERT INTO turma_disciplina(id_turma, id_disciplina)
             VALUES($1,$2) ON CONFLICT DO NOTHING`,
            [id_turma, id_disciplina]
          );

          // 8) finalmente insere em horarios
          await client.query(
            `INSERT INTO horarios(id_turma, id_disciplina, id_professor, dia_semana, horario, id_sala)
             VALUES($1,$2,$3,$4,$5,$6)`,
            [id_turma, id_disciplina, id_professor, parseInt(dia_semana), horario, id_sala]
          );

          sucesso++;
        }

        await client.query('COMMIT');
        res.json({ sucesso, erros });
      } catch (e) {
        await client.query('ROLLBACK');
        console.error('Erro na transação:', e);
        res.status(500).json({ erro: 'Falha ao processar importação', detalhes: e.message });
      } finally {
        client.release();
      }
    });
  });
};


















// require('dotenv').config();
// const express = require('express');
// const multer = require('multer');
// const csv = require('fast-csv');
// const { Pool } = require('pg');

// const app = express();
// const port = process.env.PORT || 3000;

// // Configuração do upload via Multer (memória)
// const upload = multer({ storage: multer.memoryStorage() });

// // Pool de conexões PostgreSQL
// const pool = new Pool({
// connectionString: process.env.DATABASE_URL,
// });

// // Função auxiliar: upsert genérico
// async function upsert(client, table, conflictCols, insertCols, values) {
// const cols = insertCols.join(', ');
// const params = insertCols.map((_, i) => `$${i + 1}`).join(', ');
// const updates = insertCols.map(col => `${col}=EXCLUDED.${col}`).join(', ');
// const query = `INSERT INTO ${table} (${cols}) VALUES (${params}) ON CONFLICT (${conflictCols.join(', ')}) DO UPDATE SET ${updates} RETURNING *`;
// const res = await client.query(query, values);
// return res.rows[0];
// }

// // Rota de upload CSV
// app.post('/api/upload', upload.single('file'), async (req, res) => {
// if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado.' });

// const stream = csv.parse({ headers: true, trim: true });
// const results = [];
// const errors = [];

// // Inicia transação
// const client = await pool.connect();
// try {
//   await client.query('BEGIN');
//   stream.on('error', error => { throw error; });
//   stream.on('data', async row => {
//     // Exemplo de colunas esperadas: turma, disciplina, professor, sala, dia_semana, horario
//     const { turma, disciplina, professor, sala, dia_semana, horario } = row;
//     if (!turma || !disciplina || !professor || !sala || !dia_semana || !horario) {
//       errors.push({ row, message: 'Campo obrigatório faltando' });
//       return;
//     }
//     try {
//       // Upsert em tabelas de apoio
//       const t = await upsert(client, 'turmas', ['nome'], ['nome', 'id_curso', 'id_semestre'], [turma, /*id_curso*/1, /*id_semestre*/1]);
//       const d = await upsert(client, 'disciplinas', ['nome'], ['nome', 'carga_horaria'], [disciplina, 0]);
//       const p = await upsert(client, 'professores', ['nome'], ['nome'], [professor]);
//       // Supondo tabela salas criada:
//       const s = await upsert(client, 'salas', ['nome'], ['nome'], [sala]);

//       // Insere ou atualiza horário
//       await client.query(
//         `INSERT INTO horarios (id_turma, id_disciplina, id_professor, dia_semana, horario) VALUES ($1,$2,$3,$4,$5)
//           ON CONFLICT (id_turma, id_disciplina, dia_semana, horario)
//           DO UPDATE SET id_professor = EXCLUDED.id_professor`,
//         [t.id_turma, d.id_disciplina, p.id_professor, dia_semana, horario]
//       );
//     } catch (e) {
//       errors.push({ row, message: e.message });
//     }
//   });

//   stream.on('end', async rowCount => {
//     if (errors.length > 0) {
//       await client.query('ROLLBACK');
//       res.status(400).json({ imported: rowCount - errors.length, errors });
//     } else {
//       await client.query('COMMIT');
//       res.json({ imported: rowCount });
//     }
//     client.release();
//   });

//   // Inicia leitura do buffer
//   stream.write(req.file.buffer);
//   stream.end();
// } catch (e) {
//   await client.query('ROLLBACK');
//   client.release();
//   res.status(500).json({ error: e.message });
// }
// });

// app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));