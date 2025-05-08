const btnOpcoes = document.getElementById("btn-opcoes");
      const menuOpcoes = document.getElementById("menu-opcoes");

      btnOpcoes.addEventListener("click", (e) => {
        e.stopPropagation(); // impede que o clique no botão feche o menu
        menuOpcoes.classList.toggle("show");
      });

      // Se quiser que o menu feche ao clicar fora dele:
      document.addEventListener("click", (e) => {
        if (!btnOpcoes.contains(e.target) && !menuOpcoes.contains(e.target)) {
          menuOpcoes.classList.remove("show");
        }
      });