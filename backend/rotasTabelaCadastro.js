// Rota de requisição GET, para puxar dados do banco.
app.get('/api/horario?', async(req, res) => { //Dps do horario? colocar o periodo=diurno/noturno&semestre= ao semestre
    try {
        const result = await pool.query('SELECT * FROM ? ORDER BY id'); // O ? é temporário, alterar para tabela desejada.
        res.json(result.row);
    } catch (err) {
        console.error(error);
        res.status(500).send('Erro ao buscar os dados');
    }
});

//Rota de requisição POST, para inserir os novos dados no BD.
app.post('/api/horario', async(req, res) => {
    try {
        const dados = req.body; //Array com os dados [{A definir}]
        for (const linha of dados) {
            await pool.query(
                'UPDATE ? SET ?-',
                []); //Definir endpoints
        }
        res.send('Dados atualizados');
    } catch (err) {
        console.error(error);
        res.status(500).send('Erro ao atualizar os dados');
    }
});