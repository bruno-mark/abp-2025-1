// Pega os elementos do HTML
const slide = document.querySelector('.carousel-slide');
const imagens = document.querySelectorAll('.carousel-slide img');
const botaoVoltar = document.querySelector('.carousel-btn.voltar');
const botaoAvancar = document.querySelector('.carousel-btn.avancar');

// Começamos no primeiro slide (índice 0)
var indiceAtual = 0;

// Função para mostrar a imagem correta
function mostrarSlide() {
  var deslocamento = indiceAtual * 966;
  slide.style.transform = 'translateX(-' + deslocamento + 'px)';
}


botaoAvancar.addEventListener('click', function() {
  indiceAtual = indiceAtual + 1;

  
  if (indiceAtual >= imagens.length) {
    indiceAtual = 0;
  }

  mostrarSlide();
});


botaoVoltar.addEventListener('click', function() {
  indiceAtual = indiceAtual - 1;

  
  if (indiceAtual < 0) {
    indiceAtual = imagens.length - 1;
  }

  mostrarSlide();
});