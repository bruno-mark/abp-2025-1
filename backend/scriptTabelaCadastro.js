module.exports = (app, db) => {
// Exporta o app e o bd

app.get('/scriptTabelaCadastro/:curso/:periodo/:semestre', async (req, res) => {
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
            JOIN disciplinas d ON h.id_disciplinas = d.id_disciplina
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
       for (const linha of dados) {
           await pool.query(
            `UPDATE horarios SET nome_disciplina = $1 WHERE id_disciplina = $2`,
            [nome__disciplina]
           );
       }
       res.send('Dados atualizados');
   } catch (err) {
        console.error('Erro atualizar dados', err);
        res.status(500).send('Erro ao atualizar dados');
   }
});
};