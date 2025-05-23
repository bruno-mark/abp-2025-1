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
  modalDescription.textContent = descricaoSala;
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
    const roomNameElement = botaoSala.querySelector('div:first-child'); // Assuming the first div holds the name
    const nomeSala = roomNameElement ? roomNameElement.innerText.replace(/\n/g, ' ').trim() : 'Nome Indisponível';

    // Placeholder description - you might want to fetch real descriptions later
    const descricao = `Informações sobre a sala "${nomeSala}". (Esta é uma descrição de exemplo. Você pode adicionar dados reais aqui.)`;
    abrirModal(nomeSala, descricao);
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

