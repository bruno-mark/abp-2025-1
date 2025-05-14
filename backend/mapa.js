const botao = document.getElementById('btn-opcoes');
const menu = document.getElementById('menu-opcoes');
const opcoes = document.querySelectorAll('.mapa__menu-opcao');
var imagens = document.querySelectorAll('.mapa-andar');

botao.addEventListener('click', function (evento) {
  evento.preventDefault();
  menu.classList.toggle('show');
});

opcoes.forEach(function (opcao) {
  opcao.addEventListener('click', function () {
    opcoes.forEach(function (o) {
      o.classList.remove('active');
    });
    opcao.classList.add('active');

    var andar = opcao.getAttribute('andar');

    imagens.forEach(function (img) {
      if (img.id === andar) {
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }
    });
  });
});
