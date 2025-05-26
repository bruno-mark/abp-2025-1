// Seleciona a área onde o usuário pode arrastar arquivos
const dropArea = document.getElementById("drop-area");
// Seleciona o input de arquivos escondido
const fileInput = document.getElementById("file-upload");
// Seção que mostra instruções para arrastar
const dropSection = document.getElementById("drop-section");
// Seção que mostra informações do arquivo selecionado
const fileSection = document.getElementById("file-section");
// Elemento para exibir o nome do arquivo selecionado
const fileNameDisplay = document.getElementById("selected-filename");
// Barra de progresso
const progressFill = document.getElementById("progress-fill");
// Botão para remover o arquivo
const removeFileButton = document.getElementById("remove-file");
// Botão de envio que passa a permitir enviar após validação
const removeSendButton = document.getElementById("send-button");

// Elementos do modal
const openErrorModalBtn = document.getElementById('open-error-modal'); // botão para abrir
const errorModal = document.getElementById('error-modal');      // overlay do modal
const closeErrorBtn = errorModal.querySelector('.modal-close');    // botão de fechar
const modalErrorTable = document.getElementById('modal-error-table'); // container da tabela
let dadosEditados = []; // variável global para manter os dados editados


// Lê o CSV e converte em JSON, retornando uma Promise
function readCSVandConvertToJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // FileReader lê o conteúdo do arquivo de forma assíncrona
    reader.onload = function (event) {
      const text = event.target.result;
      const lines = text.trim().split("\n");
      // Separa em linhas, removendo espaços em branco extras

      const headers = lines[0].split(",").map((h) => h.trim());
      const requiredHeaders = [
        "nome_turma",
        "nome_disciplina",
        "nome_professor",
        "dia_semana",
        "horario",
      ];

      // Verifica se há cabeçalhos obrigatórios
      const missingHeaders = requiredHeaders.filter(
        (req) => !headers.includes(req)
      );

      if (missingHeaders.length > 0) {
        exibirMensagemDeErro(
          `❌ O arquivo está com colunas faltando: ${missingHeaders.join(", ")}. Corrija antes de prosseguir.`
        );
        esconderResumoValidacao();
        return reject(new Error("Cabeçalhos obrigatórios ausentes."));
      }

      esconderMensagemDeErro();

      const jsonData = [];
      const erros = [];
      const invalidRows = []; // Linhas inválidas para tabela de edição
      let correcoes = 0;

      // Processa cada linha de dados (pulando o cabeçalho)
      lines.slice(1).forEach((line, index) => {
        const values = line.split(",").map((v) => v.trim());
        // Monta um objeto com base nos headers
        let registro = headers.reduce((obj, header, i) => {
          obj[header] = values[i] || "";
          return obj;
        }, {});

        // Faz capitalização automática nos campos de texto
        ["nome_disciplina", "nome_professor"].forEach((campo) => {
          const original = registro[campo];
          const corrigido = capitalizarNome(original.trim());
          if (original !== corrigido) {
            registro[campo] = corrigido;
            correcoes++;
          }
        });

        const linhaErros = [];

        // Valida nome_turma
        // Definição da regex (expressão regular)
        const padraoTurma = /^(?:DSM-[1-5]-N|GEO-(?:1|3|5|6)-N|MA-(?:[1-3]-N|[5-6]-M))$/
        const nomeTurmaUpper = registro["nome_turma"].toUpperCase();

        if (!padraoTurma.test(registro["nome_turma"].toUpperCase())) {
          linhaErros.push(
            `• Linha ${index + 2}: formato inválido em 'nome_turma' → "${registro["nome_turma"]}". Ex.: DSM-3-N`
          );
        } else {
          // Se válido, converte para uppercase e conta correção se necessário
          const originalValue = values[headers.indexOf("nome_turma")].trim();
          registro["nome_turma"] = nomeTurmaUpper;
          if (originalValue !== nomeTurmaUpper) {
            correcoes++;
          }
        }

        // Valida disciplina
        // Bibliotecas e utilitários para correspondência aproximada
        // Aqui usamos uma função de distância de Levenshtein para medir similaridade
        function levenshtein(a, b) {
          const dp = Array.from({ length: a.length + 1 }, () => []);
          for (let i = 0; i <= a.length; i++) dp[i][0] = i;
          for (let j = 0; j <= b.length; j++) dp[0][j] = j;
          for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
              const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
              dp[i][j] = Math.min(
                dp[i - 1][j] + 1,       // deleção
                dp[i][j - 1] + 1,       // inserção
                dp[i - 1][j - 1] + cost // substituição
              );
            }
          }
          return dp[a.length][b.length];
        }

        // Normaliza e calcula similaridade: 1 - (distância / comprimento máximo)
        function similarity(a, b) {
          const dist = levenshtein(a.trim(), b.trim());
          const maxLen = Math.max(a.length, b.length);
          return maxLen === 0 ? 1 : 1 - dist / maxLen;
        }

        // Encontra melhor correspondência em uma lista, acima de um limiar
        function getBestMatch(input, list, threshold = 0.6) {
          let best = { item: null, score: 0 };
          list.forEach((candidate) => {
            const score = similarity(input, candidate);
            if (score > best.score) {
              best = { item: candidate, score };
            }
          });
          return best.score >= threshold ? best.item : null;
        }

        // Integração dentro do loop de validação:
        // 1) Valida disciplina com correspondência aproximada
        const disciplinasPermitidas = [ 
          "Engenharia de Software I",
          "Modelagem de Banco de Dados",
          "Algoritmo",
          "Sistemas Operacionais e Redes de Computadores",
          "Desenvolvimento Web I",
          "Design Digital",
          "Técnicas de Programação I",
          "Desenvolvimento Web II",
          "Matemática para Computação",
          "Estrutura de Dados",
          "Engenharia de Software II",
          "Banco de Dados Relacional",
          "Banco de Dados não Relacional",
          "Gestão Ágil de Projetos de Software",
          "Álgebra Linear",
          "Técnicas de Programação II",
          "Desenvolvimento Web III",
          "Interação Humano Computador",
          "Inglês I",
          "Programação para Dispositivos Móveis I",
          "Laboratório de Desenvolvimento Web",
          "Internet das Coisas e Aplicações",
          "Estatística Aplicada",
          "Integração e Entrega Contínua",
          "Experiência do Usuário",
          "Inglês II",
          "Segurança no Desenvolvimento de Aplicações",
          "Aprendizagem de Máquina",
          "Computação em Nuvem I",
          "Laboratório de Desenvolvimento para Dispositivos Móveis",
          "Programação para Dispositivos Móveis II",
          "Fundamentos da Redação Técnica",
          "Inglês III",
          "Introdução à Ciência da Geoinformação",
          "Desenho Técnico",
          "Algoritmos e Lógica de Programação",
          "Cálculo",
          "Metodologia",
          "Comunicação",
          "Fundamentos de Física",
          "Estatística",
          "Topografia e Batimetria",
          "Geodésia",
          "Processamento Digital de Imagens",
          "Linguagem de Programação II",
          "Análise Ambiental",
          "WebGIS",
          "Análise Espacial e Modelagem Territorial",
          "Infraestrutura Urbana",
          "Fundamentos da Administração",
          "Projetos 1",
          "Legislação",
          "Inglês V",
          "Posicionamento por Satélite",
          "Cadastro Técnico Multifinalitário",
          "Integração e Análise de Dados Territoriais",
          "Projetos 2",
          "Padrões Distribuídos de Dados em SIG",
          "Fotogrametria Analógica e Digital",
          "Geomarketing",
          "Georreferenciamento de Imóveis Rurais",
          "Inglês VI",
          "Ciências Ambientais e das Águas",
          "Química Geral",
          "Biologia",
          "Matemática Aplicada",
          "Fundamentos da Comunicação Empresarial",
          "Sociologia Ambiental",
          "Geociência Ambiental",
          "Cartografia, Topografia e Batimetria",
          "Microbiologia",
          "Hidrologia e Recursos Hídricos",
          "SERE",
          "Físico-Química Ambiental",
          "Ecologia",
          "Climatologia e Meteorologia",
          "Hidráulica Fluvial",
          "Gestão da Qualidade",
          "Saneamento Ambiental I",
          "Planejamento e Conservação Ambiental",
          "IPDI",
          "Legislação Ambiental",
          "Planejamento e Gestão Urbana",
          "Projetos Ambientais 1",
          "Gerenciamento de Resíduos",
          "Controle e Monitoramento da Poluição Atmosférica",
          "Ecotecnologia",
          "Águas Subterrâneas",
          "Sistemas de Gestão e Auditoria Ambiental",
          "Revitalização de Rios e Recuperação de Nascentes",
          "Energias Alternativas",
          "Projetos Ambientais 2",
          "Turismo e Meio Ambiente e Recursos Hídricos",
          "Planejamento de Bacias Hidrográficas"
        ];
        {
          const original = registro.nome_disciplina;
          const match = getBestMatch(original, disciplinasPermitidas, 0.6);
          if (match) {
            if (match !== original) {
              registro.nome_disciplina = match;
              correcoes++; // conta correção automática
            }
          } else {
            linhaErros.push(
              `• Linha ${index + 2}: disciplina inválida → "${original}".`
            );
          }
        }

        // Valida professor (com correspondência aproximada)
        const professoresPermitidos = [ 
          "Prof. Me. Antonio Egydio São Thiago Graça",
          "Prof. Dr. Arley Ferreira de Souza",
          "Prof. Esp. Marcelo Augusto Sudo",
          "Prof. Esp. André Olímpio",
          "Prof. Dr. Fabrício Galende Marques de Carvalho",
          "Prof. Esp. Henrique Duarte Borges Louro",
          "Profa. Esp. Lucineide Nunes Pimenta",
          "Profa. Ma. Adriana Antividad López Valverde",
          "Profa. Dra. Rita de Cássia Silva Von Randow",
          "Prof. Me. Ronaldo Emerick Moreira",
          "Prof. Esp. Neymar Siqueira Dellareti",
          "Profa. Esp. Maria Lucia de Oliveira",
          "Prof. Me. Rodrigo Monteiro de Barros Santana",
          "Profa. Esp. Joanize Aparecida dos Santos Mohallem Paiva",
          "Prof. Me. Celso de Oliveira",
          "Profa. Dra. Karen Espinosa",
          "Prof. Dr. Daniel José de Andrade",
          "Prof. Esp. Mariana Timponi Rodrigues",
          "Profa. Dra. Vivian Hyodo",
          "Prof. Me. Adilson Rodolfo Neves",
          "Prof. Msc. Jane Delane Verona",
          "Profa. Ma. Yara da Cruz Ferreira",
          "Prof. Dr. Nilton de Jesus",
          "Profa. Msc. Risleide Lucia dos Santos",
          "Prof. Esp. Matheus de Oliveira Lorena",
          "Prof. M.Sc. Mario Sérgio Soléo Scalambrino",
          "Prof. M.Sc. Luiz Gustavo Galhardo Mendes",
          "Prof. M.Sc. Kenji Taniguchi",
          "Prof. M.Sc. Luiz Sérgio Gonçalves Aguiar",
          "Prof. M.Sc. Paulo José Maria Filho",
          "Profa. M.Sc. Fernanda da Silveira Bueno",
          "Prof. Dr. Renato Mortin",
          "Prof. Me. Gerson Freitas Júnior",
          "Prof. Me. Wellington Rios",
          "Prof. Dr. Érico Luciano Pagotto",
          "Prof. Dr. Jorge Tadao Matsushima",
          "Profa. Dra. Sanzara Nhiaia J.C. Hassmann",
          "Profa. Dra. Selma Candelária Genari",
          "Profa. Dra. Rita de Cássia von Randow",
          "Profa. Dra. Nanci de Oliveira",
          "Prof. Dr. Daniel",
          "A definir",
          "Sem professor",
          "Sem docente"
        ];
        {
          const original = registro.nome_professor;
          const match = getBestMatch(original, professoresPermitidos, 0.3);
          if (match) {
            if (match !== original) {
              registro.nome_professor = match;
              correcoes++; // conta correção automática
            }
          } else {
            linhaErros.push(
              `• Linha ${index + 2}: nome inválido de professor → "${original}".`
            );
          }
        }

        // Valida dia_semana (de 1 a 5)
        const dia = parseInt(registro["dia_semana"], 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
          linhaErros.push(
            `• Linha ${index + 2}: valor inválido em 'dia_semana' → "${registro["dia_semana"]}"`
          );
        }

        // Valida horário HH:MM-HH:MM
        const periodo = registro["nome_turma"][registro["nome_turma"].length - 1].toUpperCase();

        // Arrays com os horários válidos
        const horariosValidosMatutino = [
          "07:30-08:20",
          "08:20-09:10",
          "09:20-10:10",
          "10:10-11:00",
          "11:10-12:00",
          "12:00-12:50"
        ];
        const horariosValidosNoturno = [
          "18:45-19:35",
          "19:35-20:25",
          "20:25-21:15",
          "21:25-22:15",
          "22:15-23:05"
        ];
        // Função para verificar se os horários são válidos (incluindo verificação de periodo)
        function validarHorario(p, horario) {
          if (p == "M") {
            return horariosValidosMatutino.includes(horario);
          } else if (p == "N") {
            return horariosValidosNoturno.includes(horario);
          }
        };

        // Constante para 
        const entrada = registro["horario"];
        if (validarHorario(periodo, entrada)) {

        } else {
          linhaErros.push(
            `Linha ${index + 2}: horário inválido  → "${registro["horario"]}"`
          );
        }

        // Verifica se campos obrigatórios não estão vazios
        ["nome_turma", "nome_disciplina", "nome_professor"].forEach((campo) => {
          if (!registro[campo]) {
            linhaErros.push(`• Linha ${index + 2}: campo '${campo}' está vazio`);
          }
        });

        if (linhaErros.length > 0) {
          // Guarda as mensagens de erro gerais
          erros.push(...linhaErros);
          // Armazena o próprio registro + array de erros para exibir na tabela
          invalidRows.push({
            ...registro,
            erros: [...linhaErros]
          });
        } else {
          jsonData.push(registro);
        }

        // Exibe o resumo de validação com contagem de válidos, erros e correções
        exibirResumoValidacao(jsonData.length, erros.length, erros, correcoes);
        // agora mostra somente os inválidos:
        renderEditableTable(invalidRows);
      });
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo.'));
    };
    reader.readAsText(file);
    // Inicia a leitura do arquivo como texto
  });
}

// Exibe no DOM o arquivo selecionado, executa leitura e renderiza tabela
async function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");    // Esconde instruções de drop
  fileSection.classList.remove("hidden"); // Mostra seção de arquivo
  simulateProgressBar();                  // Anima barra de progresso
  removeFileButton.classList.remove("hidden");

  try {
    const jsonData = await readCSVandConvertToJSON(file);
    console.log("✅ Dados válidos:", jsonData);
    renderEditableTable(linhaErros);
  } catch (error) {
    console.error("❌ Erro no processamento do CSV:", error.message);
  }
}

// Restaura estado inicial da interface, limpando tudo
function resetToInitialState() {
  fileInput.value = "";
  dropSection.classList.remove("hidden");
  fileSection.classList.add("hidden");
  progressFill.style.width = "0%";
  esconderMensagemDeErro();
  esconderResumoValidacao();
  removeFileButton.classList.add("hidden");
  document.getElementById("editable-table").classList.add("hidden");
  document.getElementById("export-buttons").classList.add("hidden");
  document.getElementById("send-button").classList.add("hidden");
}

// Simula um carregamento rápido de progresso
function simulateProgressBar() {
  progressFill.style.width = "0%";
  setTimeout(() => {
    progressFill.style.width = "100%";
  }, 100);
}

// Converte nome de professor ou disciplina em formato Capitalizado, menos os conectivos, que ficam em minúsculas, e os algarismos romanos, que ficam em maiúsculas (Ex.: "engenharia de software ii" → "Engenharia de Software II")
function capitalizarNome(texto) {
  const conectivos = [
    'de', 'do', 'da', 'dos', 'das',
    'e', 'a', 'o', 'os', 'as',
    'à', 'ao', 'aos', 'às',
    'para', 'por', 'com', 'sem', 'sob', 'sobre', 'entre',
    'contra', 'perante', 'segundo', 'conforme', 'via', 'até'
  ];
  const romanos = ['i', 'ii', 'iii', 'iv'];

  // Limpa espaços extras e separa em palavras
  const palavras = texto
    .trim()
    .split(/\s+/)
    .map(p => p.toLowerCase());

  return palavras
    .map((palavra, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === palavras.length - 1;

      // Se for o último e for algarismo romano I–IV, retornar em uppercase
      if (isLast && romanos.includes(palavra)) {
        return palavra.toUpperCase();
      }

      // Sempre capitaliza a primeira palavra
      if (isFirst) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      }

      // Se for conectivo, deve ficar todo em minúsculas
      if (conectivos.includes(palavra)) {
        return palavra;
      }

      // Caso padrão: capitalize somente a primeira letra
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

// Eventos para drag & drop e clique na área
dropArea.addEventListener("click", () => fileInput.click()); // Clique abre seletor

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#4a8b92"; // Feedback visual ao arrastar
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "#5B9EA6"; // Restaura cor ao sair
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#5B9EA6";
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === "text/csv") {
    fileInput.files = files;
    showSelectedFile(files[0]);
  }
});


fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0 && fileInput.files[0].type === "text/csv") {
    showSelectedFile(fileInput.files[0]);
  }
});

removeFileButton.addEventListener("click", resetToInitialState);

// Exibe mensagem de erro na tela
function exibirMensagemDeErro(mensagem) {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = mensagem;
  errorDiv.classList.remove("hidden");
}

// Esconde a área de mensagem de erro
function esconderMensagemDeErro() {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// Exibe resumo detalhado de quantos registros foram válidos, inválidos e correções automáticas
function exibirResumoValidacao(validos, invalidos, erros, correcoes = 0) {
  const summaryDiv = document.getElementById("validation-summary");
  summaryDiv.innerHTML = `
    <p><strong>✅ Registros válidos:</strong> ${validos}</p>
    <p><strong>❌ Registros com erro:</strong> ${invalidos}</p>
    ${correcoes > 0
      ? `<p><strong>🛠 Correções automáticas aplicadas:</strong> ${correcoes}</p>`
      : ""
    }
  `;
  summaryDiv.classList.remove("hidden");
  // Revome o "hidder" para mostrar o botão "Enviar" apenas quando não holver mais erros de validação
  if (!invalidos) {
    removeSendButton.classList.remove("hidden");
  };
}

// Limpa o resumo de validação da interface
function esconderResumoValidacao() {
  const summaryDiv = document.getElementById("validation-summary");
  summaryDiv.innerHTML = "";
  summaryDiv.classList.add("hidden");
}

// Renderiza uma tabela editável com os dados JSON
function renderEditableTable(data) {
  const tableContainer = document.getElementById("editable-table");
  tableContainer.innerHTML = "";
  dadosEditados = data; // salva os dados editados na variável global


  if (!data.length) return;

  const tableHeaders = Object.keys(data[0]);
  let tableHTML =
    "<table border='1' style='width:100%; border-collapse: collapse;'>";

  // Cabeçalho
  tableHTML += "<thead><tr>";
  tableHeaders.forEach((h) => {
    tableHTML += `<th style="padding: 8px; background-color: #4a8b92; color: white;">${h}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  // Linhas de dados
  data.forEach((row, rowIndex) => {
    tableHTML += "<tr>";
    tableHeaders.forEach((h) => {
      tableHTML += `<td contenteditable="true" data-row="${rowIndex}" data-key="${h}" style="padding: 6px; background-color: white; color: black;">${row[h]}</td>`;
    });
    tableHTML += "</tr>";
  });

  tableHTML += "</tbody></table>";
  tableContainer.innerHTML = tableHTML;
  document.getElementById("export-buttons").classList.remove("hidden");
  // Atualiza o objeto `data` ao editar células na tabela
  tableContainer
    .querySelectorAll("td[contenteditable=true]")
    .forEach((cell) => {
      cell.addEventListener("input", () => {
        const row = parseInt(cell.dataset.row, 10);
        const key = cell.dataset.key;
        data[row][key] = cell.textContent.trim();
        console.log("🔄 JSON atualizado:", data);
      });
    });

  // Adicionar o botão de verificação para a tabela de correção
  const buttonCheckTable = document.createElement('button');
  buttonCheckTable.textContent = 'Verificar';
  buttonCheckTable.style.color = 'black';
  buttonCheckTable.addEventListener('click', checkTable); 
  tableContainer.appendChild(buttonCheckTable);
}

function checkTable() {
  alert("Olá!");
}

/**
 * Mostra o modal e insere a tabela de erros.
 */
function showErrorModal() {
  // Copia a tabela de erros existente (renderEditableTable em #editable-table)
  modalErrorTable.innerHTML = document.getElementById('editable-table').innerHTML;
  // Exibe o overlay
  errorModal.classList.remove('hidden');
  errorModal.setAttribute('aria-hidden', 'false');
}

/**
 * Esconde o modal
 */
function hideErrorModal() {
  errorModal.classList.add('hidden');
  errorModal.setAttribute('aria-hidden', 'true');
}

// Abre modal ao clicar no botão
openErrorModalBtn.addEventListener('click', showErrorModal);

// Fecha modal ao clicar no botão de fechar
closeErrorBtn.addEventListener('click', hideErrorModal);

// Fecha modal ao clicar fora do conteúdo
errorModal.addEventListener('click', (e) => {
  if (e.target === errorModal) hideErrorModal();
});
