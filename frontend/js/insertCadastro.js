document.addEventListener("DOMContentLoaded", () => {
    const selects = document.querySelectorAll(".disciplina-select");
    const tabelaBody = document.querySelector(".horario__tabela tbody");

    // Adiciona os seletores de curso, periodo e semestre
    const selectCurso = document.getElementById("curso");
    const selectPeriodo = document.getElementById("periodo");
    const selectSemestre = document.getElementById("semestre");

    let jsonDataOriginal = []; // Vai armazenar os dados do banco
    let disciplinaInfoMap = {}; // Mapeamento de disciplina para professor/turma
    let contagemDisciplinas = {}; // Contagem de aulas por disciplina
    let disciplinasUnicas = []; // Lista de disciplinas únicas

    // --- Funções Auxiliares (mantidas e adaptadas) ---

    function atualizarOpcoes() {
        const selecionados = Array.from(selects)
            .map(select => select.value)
            .filter(val => val !== "");

        const contagemSelecionados = {};
        selecionados.forEach(disciplina => {
            contagemSelecionados[disciplina] = (contagemSelecionados[disciplina] || 0) + 1;
        });

        selects.forEach(select => {
            const valorAtualSelect = select.value;
            Array.from(select.options).forEach(option => {
                if (option.value === "") return;
                const disciplinaOpcao = option.value;
                const countJaSelecionados = contagemSelecionados[disciplinaOpcao] || 0;
                const countTotalPermitido = contagemDisciplinas[disciplinaOpcao] || 0;

                if (disciplinaOpcao === valorAtualSelect) {
                    option.disabled = false;
                } else {
                    option.disabled = countJaSelecionados >= countTotalPermitido;
                }
            });
        });
    }

    function popularSelectsInicial() {
        selects.forEach(select => {
            select.innerHTML = '<option value="">Selecione...</option>';
            disciplinasUnicas.forEach(disciplina => {
                const option = document.createElement("option");
                option.value = disciplina;
                option.textContent = disciplina;
                select.appendChild(option);
            });
        });
        atualizarOpcoes();
    }

    function gerarJsonAtualizado() {
        const novoJsonData = [];
        let novoIdHorario = 1;

        selects.forEach(select => {
            const disciplinaSelecionada = select.value;

            if (disciplinaSelecionada) {
                const diaSemana = select.getAttribute("data-dia");
                const horario = select.getAttribute("data-horario");

                const info = disciplinaInfoMap[disciplinaSelecionada] || { professor: "N/A", turma: "N/A" };

                novoJsonData.push({
                    // Se você for atualizar, é crucial ter o id_horario original aqui!
                    // Senão, o backend não saberá qual linha atualizar.
                    // Isso significa que ao popular a tabela, você precisaria armazenar o id_horario.
                    // Por enquanto, vamos manter como um novo ID, mas idealmente seria o ID do banco.
                    id_horario: novoIdHorario++, // Este ID é apenas para o JSON gerado, não o ID do banco
                    nome_turma: info.turma,
                    nome_disciplina: disciplinaSelecionada,
                    nome_professor: info.professor,
                    dia_semana: diaSemana,
                    horario: horario
                });
            }
        });
        return novoJsonData;
    }

    // --- NOVA FUNÇÃO: Carregar Dados do Backend ---
    async function carregarDadosHorarios() {
        const curso = selectCurso.value;
        const periodo = selectPeriodo.value;
        const semestre = selectSemestre.value;

        if (!curso || !periodo || !semestre) {
            console.warn("Selecione Curso, Período e Semestre para carregar os horários.");
            return;
        }

        try {
            // Monta a URL da sua API
            const url = `http://localhost:3010/scriptTabelaCadastro/${curso}/${periodo}/${semestre}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const data = await response.json();
            jsonDataOriginal = data; // Atualiza com os dados do banco

            // Repopular os mapas e listas com os novos dados
            disciplinaInfoMap = {};
            jsonDataOriginal.forEach(item => {
                if (!disciplinaInfoMap[item.nome_disciplina]) {
                    disciplinaInfoMap[item.nome_disciplina] = {
                        professor: item.nome_professor,
                        turma: item.nome_turma
                    };
                }
            });

            contagemDisciplinas = {};
            jsonDataOriginal.map(item => item.nome_disciplina).forEach(disciplina => {
                contagemDisciplinas[disciplina] = (contagemDisciplinas[disciplina] || 0) + 1;
            });

            disciplinasUnicas = [...new Set(jsonDataOriginal.map(item => item.nome_disciplina))];

            // Preecher a tabela com os dados do banco
            preencherTabela(jsonDataOriginal);
            popularSelectsInicial(); // Atualiza as opções dos selects com as disciplinas do banco
            console.log("Dados dos horários carregados do banco:", jsonDataOriginal);

        } catch (error) {
            console.error("Erro ao carregar os dados dos horários do backend:", error);
            alert("Erro ao carregar os horários. Verifique o console para mais detalhes.");
        }
    }

    // --- NOVA FUNÇÃO: Preencher Tabela com os Dados do Banco ---
    function preencherTabela(data) {
        // Limpa todos os selects antes de preencher
        selects.forEach(select => {
            select.value = ""; // Reseta o valor selecionado
        });

        data.forEach(item => {
            // Encontra o select correspondente ao dia e horário
            const select = document.querySelector(
                `.disciplina-select[data-dia="${item.dia_semana}"][data-horario="${item.horario}"]`
            );

            if (select) {
                // Define o valor do select com a disciplina do banco
                select.value = item.nome_disciplina;
                // Opcional: Você pode querer armazenar o id_horario no select para uso futuro na atualização
                // select.setAttribute('data-id-horario', item.id_horario);
            }
        });
        atualizarOpcoes(); // Atualiza o estado dos selects (disponibilidade)
    }


    // --- Event Listeners para os selects de filtro ---
    selectCurso.addEventListener("change", carregarDadosHorarios);
    selectPeriodo.addEventListener("change", carregarDadosHorarios);
    selectSemestre.addEventListener("change", carregarDadosHorarios);


    // --- Inicialização e Event Listeners de Horários ---

    // Adiciona listener de mudança para cada select de disciplina
    selects.forEach(select => {
        select.addEventListener("change", atualizarOpcoes);
    });

    // --- Exemplo de como usar a função gerarJsonAtualizado e enviar para o backend ---
    const btnGerarJson = document.getElementById("gerarJsonBtn"); // ID CORRIGIDO!

    if (btnGerarJson) {
        btnGerarJson.addEventListener("click", async () => {
            const jsonParaEnviar = gerarJsonAtualizado(); // Gera o JSON com as seleções atuais

            try {
                // Envia os dados para a sua rota de INSERT/UPDATE no backend
                const response = await fetch('http://localhost:3010/scriptTabelaCadastro/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonParaEnviar) // Converte o JSON para string
                });

                if (!response.ok) {
                    throw new Error(`Erro ao salvar os horários! Status: ${response.status}`);
                }

                const resultado = await response.text(); // Ou response.json() se o backend retornar JSON
                alert("Horários salvos com sucesso! Mensagem do servidor: " + resultado);
                console.log("JSON enviado para o backend:", jsonParaEnviar);

            } catch (error) {
                console.error("Erro ao enviar os horários para o backend:", error);
                alert("Erro ao salvar os horários. Verifique o console para mais detalhes.");
            }
        });
    } else {
        console.warn("Botão 'gerarJsonBtn' ou área de output 'jsonOutput' não encontrados no HTML.");
    }

    // Chamar para carregar os dados iniciais quando a página carregar
    // **Importante:** Se você tem valores padrão para curso, período e semestre,
    // chame `carregarDadosHorarios()` aqui. Caso contrário,
    // os horários só serão carregados depois que o usuário selecionar os filtros.
    // carregarDadosHorarios();
});