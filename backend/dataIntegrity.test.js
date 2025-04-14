// tests/integridade.test.js
const { Client } = require("pg");
require('dotenv').config({ path: '../.env' });


// Conexão com o banco
const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

beforeAll(() => db.connect());
afterAll(() => db.end());

// 🧪 TESTE 1: Horários sem professor
test("Todos os horários devem estar vinculados a um professor", async () => {
  const res = await db.query(`
    SELECT h.id_horario
    FROM Horario h
    LEFT JOIN Alocacao_Horario ah ON h.id_alocacao = ah.id_alocacao
    WHERE ah.id_professor IS NULL
  `);
  expect(res.rowCount).toBe(0);
});

// 🧪 TESTE 2: Disciplinas devem estar vinculadas a pelo menos uma turma
test("Todas as disciplinas devem estar associadas a alguma turma", async () => {
  const res = await db.query(`
    SELECT d.id_disciplina
    FROM Disciplina d
    LEFT JOIN Disciplina_Turma dt ON d.id_disciplina = dt.id_disciplina
    WHERE dt.id_turma IS NULL
  `);
  expect(res.rowCount).toBe(0);
});

// 🧪 TESTE 3: Hora de início deve ser menor que hora de fim
test("Hora de início deve ser menor que hora de fim", async () => {
  const res = await db.query(`
    SELECT id_horario
    FROM Horario
    WHERE hora_inicio >= hora_fim
  `);
  expect(res.rowCount).toBe(0);
});

// 🧪 TESTE 4: Professores não podem ter sobreposição de horários
test("Professores não devem ter conflitos de horário", async () => {
  const res = await db.query(`
    SELECT h1.id_horario AS horario1, h2.id_horario AS horario2
    FROM Horario h1
    JOIN Alocacao_Horario a1 ON h1.id_alocacao = a1.id_alocacao
    JOIN Horario h2 ON h1.id_horario < h2.id_horario
    JOIN Alocacao_Horario a2 ON h2.id_alocacao = a2.id_alocacao
    WHERE a1.id_professor = a2.id_professor
      AND h1.dia_semana = h2.dia_semana
      AND h1.hora_inicio < h2.hora_fim
      AND h1.hora_fim > h2.hora_inicio
  `);
  expect(res.rowCount).toBe(0);
});
