const botao = document.getElementById('btn-opcoes');
const menu = document.getElementById('menu-opcoes');
const opcoes = document.querySelectorAll('.mapa__menu-opcao');
const andaresContainer = document.querySelector('.mapa__imagem-container'); // Container dos andares (usado para delegação de eventos)
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModalBtn = document.querySelector('.modal-close');

// Mostra ou oculta o menu suspenso de opções de andares
botao.addEventListener('click', function (evento) {
  evento.preventDefault();
  menu.classList.toggle('show');
});

// Função para carregar o conteúdo HTML de um andar específico
function carregarAndar(andarId) {
  // Esconde todos os andares
  document.querySelectorAll('.mapa-andar').forEach(el => el.style.display = 'none');

  const container = document.getElementById(andarId);
  if (!container) {
    console.error(`Elemento com ID ${andarId} não encontrado.`);
    return;
  }

  // Exibe o andar selecionado
  container.style.display = 'block';

  // Busca e carrega o conteúdo HTML correspondente ao andar
  fetch(`./mapa/${andarId}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(error => {
      console.error(`Erro ao carregar ${andarId}.html:`, error);
      container.innerHTML = `<p>Erro ao carregar o mapa do andar ${andarId}.</p>`;
    });
}

// Carrega automaticamente o térreo ao iniciar
carregarAndar('terreo');

// Adiciona eventos aos botões de troca de andar
opcoes.forEach(function (opcao) {
  opcao.addEventListener('click', function () {
    // Atualiza o botão ativo
    opcoes.forEach(o => o.classList.remove('active'));
    opcao.classList.add('active');

    const andar = opcao.getAttribute('andar');
    carregarAndar(andar);
  });
});

// Função para abrir o modal com informações da sala
function abrirModal(nomeSala, descricaoSala) {
  modalTitle.textContent = nomeSala;
  modalDescription.innerHTML = descricaoSala;
  modal.classList.remove('hidden'); // Corrected typo: classList
}

// Fecha o modal ao clicar no botão de fechar (X)
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Fecha o modal ao clicar fora da área de conteúdo
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});

// Usa delegação de eventos para detectar cliques em botões de salas
andaresContainer.addEventListener('click', function (event) {
  // Verifica se o clique foi em uma sala que não está desativada
  const botaoSala = event.target.closest('.sala:not(.desativada)');
  if (botaoSala) {

    // Extract room name - improved to handle potential nested elements like status divs
    const nomeSala = botaoSala.value;

    fetch(`http://localhost:3010/mapa/${nomeSala}`)
      .then(response => {
        if(!response.ok) throw new Error("Erro ao carregar dados da sala");
        return response.json();
      })
      .then(dados => {
        let descricaoHtml;
        if(dados.length === 0){
          descricaoHtml = `<p>Não há aulas nessa sala "${nomeSala}".</p>`;
        } else {
          descricaoHtml = gerarTabelaHorarios(dados);
          console.log("Dados da sala:", dados);
        }

        abrirModal(nomeSala, descricaoHtml);
      })
      .catch(erro => {
        console.error("Erro ao buscar dados:", erro);
        abrirModal(nomeSala, `<p>Erro ao carregar informações da sala "${nomeSala}".</p>`);
      });
  }
});

// Garante que apenas o térreo esteja visível inicialmente
document.querySelectorAll('.mapa-andar').forEach(el => {
  if (el.id !== 'terreo') {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
});

function gerarTabelaHorarios(dados) {
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horarios = ['18:45-19:35', '19:35-20:25', '20:25-21:15', '21:25-22:15', '22:15-23:05'];

  const diaIndice = {
    Segunda: 0,
    Terça: 1,
    Quarta: 2,
    Quinta: 3,
    Sexta: 4,
  };

  const horarioIndice = {
    "18:45-19:35": 0,
    "19:35-20:25": 1,
    "20:25-21:15": 2,
    "21:25-22:15": 3,
    "22:15-23:05": 4,
  };

  // Cria matriz vazia [horários][dias]
  const matriz = Array.from({ length: horarios.length }, () => Array(dias.length).fill(''));

  dados.forEach(item => {
    const linha = horarioIndice[item.horario];
    const coluna = diaIndice[item.dia_semana];
    if (linha !== undefined && coluna !== undefined) {
      const conteudo = `<small>${item.nome_disciplina}</small>`;
      matriz[linha][coluna] += matriz[linha][coluna] ? `<hr>${conteudo}` : conteudo;
    }
  });

  // Monta a tabela em HTML sem estilos inline
  let html = '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">';
  html += '<thead><tr><th>Horário</th>' + dias.map(d => `<th>${d}</th>`).join('') + '</tr></thead>';
  html += '<tbody>';
  horarios.forEach((h, i) => {
    html += `<tr><td><strong>${h}</strong></td>`;
    html += matriz[i].map(cel => `<td>${cel || ''}</td>`).join('');
    html += '</tr>';
  });
  html += '</tbody></table>';

  return html;
}