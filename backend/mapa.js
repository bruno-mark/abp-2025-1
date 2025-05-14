  const btn = document.getElementById('btn-opcoes');
  const menu = document.getElementById('menu-opcoes');
  const opcoes = document.querySelectorAll('.mapa__menu-opcao');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.toggle('show');
  });

  opcoes.forEach((opcao) => {
    opcao.addEventListener('click', () => {
      opcoes.forEach(o => o.classList.remove('active'));
      opcao.classList.add('active');
    });
  });