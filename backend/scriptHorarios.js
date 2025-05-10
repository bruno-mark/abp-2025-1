//seleciona os selects curso, periodo semestre
const cursoSelect = document.getElementById("curso");
const periodoSelect = document.getElementById("periodo");
const semestreSelect = document.getElementById("semestre");
//pega o tbody, onde os dados serão preenchidos automaticamente
const corpoTabela = document.querySelector("tbody");

// cria uma array com dias da semana em ordem (segunda a sexta) pra que eles possam ser exibidos sempre na mesma ordem e serve como guia para montar as tabelas
const dias = ["segunda", "terca", "quarta", "quinta", "sexta"];

// Função para formatar o horário recebe dois horarios e retorna uma string no formato "18:45 às 19:35".
function formatarHorario(inicio, fim) {
  return `${inicio} às ${fim}`;
}

// Função principal que atualiza a tabela ao mudar os selects
async function atualizarTabela() {
  //le o que o usuario escolheu ao clicar nos selects e usa pra montar a URL de requisição
  const curso = cursoSelect.value;
  const periodo = periodoSelect.value;
  const semestre = semestreSelect.value;

  try {
    //frontend envia uma requisição GET pra rota /horarios do back passando os parametros (com as variaveis) na URL 
    const response = await fetch(`http://localhost:3000/horarios?curso=${curso}&periodo=${periodo}&semestre=${semestre}`);
    const dados = await response.json();
    //evita
    corpoTabela.innerHTML = ""; // Limpa a tabela antes de inserir os novos dados

    if (dados.length > 0) {
      // Agrupa os dados por faixa de horário
      const horariosMap = {};

      dados.forEach(item => {
        const horario = formatarHorario(item.hora_inicio, item.hora_fim);

        if (!horariosMap[horario]) {
          horariosMap[horario] = {};
        }

        horariosMap[horario][item.dia_semana] = `${item.nome_professor} (${item.nome_ambiente})`;
      });

      // Monta a tabela com base no agrupamento
      for (const horario in horariosMap) {
        const tr = document.createElement("tr");

        // Primeira coluna: faixa de horário
        const tdHorario = document.createElement("td");
        tdHorario.textContent = horario;
        tr.appendChild(tdHorario);

        // Colunas de segunda a sexta
        dias.forEach(dia => {
          const td = document.createElement("td");
          td.textContent = horariosMap[horario][dia] || "";
          tr.appendChild(td);
        });

        corpoTabela.appendChild(tr);
      }
    } else {
      // Caso não existam dados para essa combinação
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.textContent = "Horário não disponível.";
      tr.appendChild(td);
      corpoTabela.appendChild(tr);
    }

  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
  }
}

// Eventos para atualizar a tabela quando os selects mudam
cursoSelect.addEventListener("change", atualizarTabela);
periodoSelect.addEventListener("change", atualizarTabela);
semestreSelect.addEventListener("change", atualizarTabela);

// Atualiza a tabela ao carregar a página
window.addEventListener("DOMContentLoaded", atualizarTabela);