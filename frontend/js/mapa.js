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
  modalDescription.textContent = descricaoSala;
  modal.classList.remove('hidden');
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
    // Obtém o nome da sala (primeiro <div> dentro do botão)
    const roomNameElement = botaoSala.querySelector('div:first-child');
    const nomeSala = roomNameElement ? roomNameElement.innerText.replace(/\n/g, ' ').trim() : 'Nome Indisponível';

    // Descrição fictícia (pode ser substituída por dados reais futuramente)
    const descricao = `Informações sobre a sala "${nomeSala}". (Esta é uma descrição de exemplo. Você pode adicionar dados reais aqui.)`;
    abrirModal(nomeSala, descricao);
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


