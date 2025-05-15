document.getElementById("filtrar_btn").addEventListener("click", async () => {
  const curso = document.getElementById("curso").value;
  const periodo = document.getElementById("periodo").value;
  const semestre = document.getElementById("semestre").value;

  try {
    const response = await fetch(`http://localhost:3010/scriptHorarios/${curso}/${periodo}/${semestre}`);
    const dados = await response.json();


    const diaIndice = {
      Segunda: 1,
      Terça: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
    };

    const horarioIndice = {
      "18:45-19:35": 0,
      "19:35-20:25": 1,
      "20:25-21:15": 2,
      "21:25-22:15": 3,
      "22:15-23:05": 4,
    };

    const tabela = document.querySelector("#corpoTabela");

    dados.forEach((item) => {
      const linha = horarioIndice[item.horario];
      const coluna = diaIndice[item.dia_semana];

      if (linha === undefined || coluna === undefined) return;

      const linhaTabela = tabela.rows[linha];
      const celula = linhaTabela.cells[coluna];

      const conteudo = `${item.nome_disciplina}<br>`;
      celula.innerHTML = "";
      if (celula.innerHTML.trim() !== "") {
        celula.innerHTML += `<hr>${conteudo}`;
      } else {
        celula.innerHTML = conteudo;
      }
    });

    const professores = {};

    // Percorre todos os itens do JSON
    dados.forEach((item) => {
      const nome = item.nome_professor;
      const disciplina = item.nome_disciplina;

      // Se o professor ainda não estiver no objeto, cria uma lista nova
      if (!professores[nome]) {
        professores[nome] = new Set(); // Set evita repetições automáticas
      }

      // Adiciona a disciplina ao conjunto do professor
      professores[nome].add(disciplina);
    });

    // Exibe o resultado
    const lista = document.createElement("ul");

    for (const [professor, disciplinas] of Object.entries(professores)) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${professor}</strong>: ${[...disciplinas].join(
        ", "
      )}`;
      lista.appendChild(li);
    }

    const divDocentes = document.querySelector(".docentes");
    divDocentes.innerHTML = "";
    divDocentes.appendChild(lista);


    // Aqui o resto do seu código para preencher a tabela e docentes
  } catch (erro) {
    console.error("Erro ao carregar os dados da tabela:", erro);
  }
});
