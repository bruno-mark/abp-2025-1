const botao = document.getElementById('btn-opcoes');
const menu = document.getElementById('menu-opcoes');
const opcoes = document.querySelectorAll('.mapa__menu-opcao');
const andaresContainer = document.querySelector('.mapa__imagem-container'); // Target the container for delegation
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description'); // Corrected ID
const closeModalBtn = document.querySelector('.modal-close');

botao.addEventListener('click', function (evento) {
  evento.preventDefault();
  menu.classList.toggle('show');
});

// Função genérica para carregar HTML do andar
function carregarAndar(andarId) {
  // Hide all floors first
  document.querySelectorAll('.mapa-andar').forEach(el => el.style.display = 'none');

  const container = document.getElementById(andarId);
  if (!container) {
      console.error(`Container element with ID ${andarId} not found.`);
      return;
  }
  // Show the target floor container
  container.style.display = 'block';

  // Fetch and load content using the original path structure
  fetch(`./mapa/${andarId}.html`) // Using original path structure
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(error => {
      console.error(`Erro ao carregar ${andarId}.html:`, error);
      container.innerHTML = `<p>Erro ao carregar o mapa do andar ${andarId}.</p>`; // Provide feedback
    });
}

// Carrega o térreo ao iniciar
carregarAndar('terreo');

opcoes.forEach(function (opcao) {
  opcao.addEventListener('click', function () {
    // Atualiza botão ativo
    opcoes.forEach(o => o.classList.remove('active'));
    opcao.classList.add('active');

    const andar = opcao.getAttribute('andar');

    // Carrega o conteúdo do andar selecionado
    carregarAndar(andar);
  });
});

function abrirModal(nomeSala, descricaoSala) {
  modalTitle.textContent = nomeSala;
  modalDescription.innerHTML = descricaoSala;
  modal.classList.remove('hidden'); // Corrected typo: classList
}

// Função para fechar o modal
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});

// Use event delegation on the container that holds the dynamic content
andaresContainer.addEventListener('click', function (event) {
  // Check if the clicked element or its parent is a button with class 'sala' and NOT 'desativada'
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

// Initial setup for the first floor display (redundant with carregarAndar('terreo') call, but ensures correct display logic)
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
