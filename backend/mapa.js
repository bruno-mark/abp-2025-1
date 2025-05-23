const botao = document.getElementById('btn-opcoes');
const menu = document.getElementById('menu-opcoes');
const opcoes = document.querySelectorAll('.mapa__menu-opcao');
const andares = document.querySelectorAll('.mapa-andar');

botao.addEventListener('click', function (evento) {
  evento.preventDefault();
  menu.classList.toggle('show');
});

// Função genérica para carregar HTML do andar
function carregarAndar(andarId) {
  fetch(`./mapa/${andarId}.html`)
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById(andarId);
      container.innerHTML = html;
    })
    .catch(error => {
      console.error(`Erro ao carregar ${andarId}.html:`, error);
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

    andares.forEach(function (el) {
      el.style.display = (el.id === andar) ? 'block' : 'none';
    });

    // Carrega o conteúdo do andar selecionado
    carregarAndar(andar);
  });
});