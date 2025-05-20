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

let currentJsonData = []; // Armazena temporariamente os dados convertidos do CSV

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
        ["nome_turma", "nome_disciplina", "nome_professor"].forEach((campo) => {
          const original = registro[campo];
          const corrigido = capitalizarNome(original.trim());
          if (original !== corrigido) {
            registro[campo] = corrigido;
            correcoes++;
          }
        });

        const linhaErros = []; 


        // Ordem: turma, disciplina, professor, dia da semana, horario

        //APAGAR ESSA LINHA E A DEBAIXO ANTES DE COMMITAR
        //Também quero saber se posso melhorá-la da seguinte maneira: gostaria de poder alterar a possibilidade de número (o que vai de um a seis) de acordo com o curso (GEO|DSM|MA) e se, também com base no curso, posso restringir a possibilidade de por M ou N
       
        // Valida nome_turma
        // Definição do regex:
        const padrao = /^(?:DSM|GEO|MA)-[1-6]-(?:N|M)$/;
        if (!padrao.test(registro["nome_turma"].toUpperCase())) {
          linhaErros.push(
            `• Linha ${index + 2}: formato inválido em 'nome_turma' → "${registro["nome_turma"]}". Ex.: DSM-3-N`
          );
        }

        // Valida disciplina
        // 1) Array com todas as disciplinas:
        const disciplinasPermitidas = [
          "ALGORITMOS E LÓGICA DE PROGRAMAÇÃO",
          "DESENVOLVIMENTO WEB I",
          "DESIGN DIGITAL",
          "ENGENHARIA DE SOFTWARE I",
          "MODELAGEM DE BANCO DE DADOS",
          "SISTEMAS OPERACIONAIS E REDES DE COMPUTADORES",
          "TÉCNICAS DE PROGRAMAÇÃO I",
          "DESENVOLVIMENTO WEB II",
          "MATEMÁTICA PARA COMPUTAÇÃO",
          "ENGENHARIA DE SOFTWARE II",
          "BANCO DE DADOS - RELACIONAL",
          "ESTRUTURA DE DADOS",
          "TÉCNICAS DE PROGRAMAÇÃO II",
          "DESENVOLVIMENTO WEB III",
          "ÁLGEBRA LINEAR",
          "GESTÃO ÁGIL DE PROJETOS DE SOFTWARE",
          "BANCO DE DADOS - NÃO RELACIONAL",
          "INTERAÇÃO HUMANO COMPUTADOR",
          "INGLÊS I",
          "INTEGRAÇÃO E ENTREGA CONTÍNUA",
          "LABORATÓRIO DE DESENVOLVIMENTO WEB",
          "INTERNET DAS COISAS E APLICAÇÕES",
          "PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS I",
          "ESTATÍSTICA APLICADA",
          "EXPERIÊNCIA DO USUÁRIO",
          "INGLÊS II",
          "COMPUTAÇÃO EM NUVEM I",
          "APRENDIZAGEM DE MÁQUINA",
          "LABORATÓRIO DE DESENVOLVIMENTO PARA DISPOSITIVOS MÓVEIS",
          "PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS II",
          "SEGURANÇA NO DESENVOLVIMENTO DE APLICAÇÕES",
          "FUNDAMENTOS DA REDAÇÃO TÉCNICA",
          "INGLÊS III",
          "INTRODUÇÃO À CIÊNCIA DA GEOINFORMAÇÃO",
          "DESENHO TÉCNICO",
          "METODOLOGIA DA PESQUISA CIENTÍFICO-TECNOLÓGICA",
          "FUNDAMENTOS DE FÍSICA",
          "CÁLCULO",
          "FUNDAMENTOS DA COMUNICAÇÃO EMPRESARIAL",
          "TOPOGRAFIA E BATIMETRIA", 
          "GEODÉSIA",
          "LINGUAGEM DE PROGRAMAÇÃO II",
          "MODELAGEM DE BANCO DE DADOS ESPACIAL",
          "PROCESSAMENTO DIGITAL DE IMAGENS",
          "PROJETOS EM GEOPROCESSAMENTO I",
          "ANÁLISE AMBIENTAL POR GEOPROCESSAMENTO",
          "GEOPROCESSAMENTO APLICADO À INFRAESTRUTURA URBANA",
          "TECNOLOGIAS WEB APLICADAS A SISTEMAS DE INFORMAÇÃO GEOGRÁFICA",
          "ANÁLISE ESPACIAL E MODELAGEM DE TERRENOS",
          "FUNDAMENTOS DA ADMINISTRAÇÃO GERAL",
          "LEGISLAÇÃO E NORMAS PARA GEOPROCESSAMENTO",
          "INGLÊS V",
          "PROJETOS EM GEOPROCESSAMENTO II",
          "GEOMARKETING",
          "FOTOGRAMETRIA ANALÓGICA E DIGITAL",
          "INTEGRAÇÃO E ANÁLISE DE DADOS TERRITORIAIS",
          "CADASTRO TÉCNICO MULTIFINALITÁRIO",
          "POSICIONAMENTO POR SATÉLITE",
          "PADRÕES DE DISTRIBUIÇÃO DE INFORMAÇÕES EM SIG",
          "GEORREFERENCIAMENTO DE IMÓVEIS RURAIS",
          "INGLÊS VI",
          "CIÊNCIAS AMBIENTAIS E DAS ÁGUAS",
          "BIOLOGIA",
          "SOCIOLOGIA AMBIENTAL",
          "MATEMÁTICA APLICADA",
          "QUÍMICA GERAL",
          "GEOCIÊNCIA AMBIENTAL",
          "HIDROLOGIA E RECURSOS HÍDRICOS",
          "ECOLOGIA",
          "CARTOGRAFIA, TOPOGRAFIA E BATIMETRIA",
          "SENSORIAMENTO REMOTO E GEOPROCESSAMENTO",
          "CLIMATOLOGIA E METEOROLOGIA",
          "MICROBIOLOGIA AMBIENTAL",
          "FÍSICO-QUÍMICA APLICADA À GESTÃO AMBIENTAL", 
          "HIDRÁULICA FLUVIAL",
          "LIMNOLOGIA",
          "PLANEJAMENTO E CONSERVAÇÃO AMBIENTAL",
          "INTERPRETAÇÃO E PROCESSAMENTO DIGITAL DE IMAGENS",
          "GESTÃO DA QUALIDADE",
          "SANEAMENTO AMBIENTAL I"
        ];
        // 2) Função de validação:
        function validarDisciplina(nome) {
          return disciplinasPermitidas.includes(nome.trim().toUpperCase());
        }
        // 3) Exemplo de uso dentro do seu loop:
        if (!validarDisciplina(registro.nome_disciplina)) {
          linhaErros.push(
            `• Linha ${index + 2}: disciplina inválida → "${registro.nome_disciplina}".`
          );
        }

        // Valida nome_professor
        // 1) Array com todos os nomes de professor em MAIÚSCULAS
        const professoresPermitidos = [
          "ADILSON NEVES",
          "ADRIANA VALVERDE",
          "ÁLVARO GONÇALVES",
          "ANDRÉ OLÍMPIO",
          "ANTONIO GRAÇA",
          "ANTONIO RIOS",
          "ARLEY SOUZA",
          "CELSO OLIVEIRA",
          "DANIEL ANDRADE",
          "DANIELE TAVARES",
          "FABRÍCIO CARVALHO",
          "FERNANDA BUENO",
          "GERSON JÚNIOR",
          "HENRIQUE LOURO",
          "JANE VERONA",
          "JOANIZE PAIVA",
          "JORGE MATSUSHIMA",
          "KAREN SARMIENTO",
          "LEANDRO HOFFMANN",
          "LEONARDO VITTO",
          "LUCINEIDE PIMENTA",
          "LUIZ MENDES",
          "LUIZ AGUIAR",
          "MARCELO SUDO",
          "MARIA OLIVEIRA",
          "MARIANA RODRIGUES",
          "MÁRIO SCALAMBRINO",
          "MATHEUS LORENA",
          "NANCI OLIVEIRA",
          "NEYMAR DELLARETI",
          "NILTON JESUS",
          "PAULO FILHO",
          "PEDRO SILVA",
          "RENATO MORTIN",
          "RITA RANDOW",
          "RONALDO MOREIRA",
          "SANZARA HASSMANN",
          "SELMA GENARI",
          "VIVIAN HYODO",
          "YARA FERREIRA",
          "MARCELO BANDORIA",
          "ÉRICO PAGOTTO"
        ];
        // Função de validação
        function validarProfessor(nome) {
          return professoresPermitidos.includes(nome.trim().toUpperCase());
        }
        // Uso no loop
        if (!validarProfessor(registro.nome_professor)) {
          linhaErros.push(
            `• Linha ${index + 2}: nome inválido de professor → "${registro.nome_professor}".`
          );
        } 

        // Valida dia_semana (de 1 a 5)
        const dia = parseInt(registro["dia_semana"], 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
          linhaErros.push(
            `• Linha ${index + 2}: valor inválido em 'dia_semana' → "${registro["dia_semana"]}"`
          );
        }

        // Valida formato de horário HH:MM-HH:MM
        const horarioRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
        if (!horarioRegex.test(registro["horario"])) {
          linhaErros.push(
            `• Linha ${index + 2}: formato inválido de 'horario' → "${registro["horario"]}"`
          );
        }

        // Verifica se campos obrigatórios não estão vazios
        ["nome_turma", "nome_disciplina", "nome_professor"].forEach((campo) => {
          if (!registro[campo]) {
            linhaErros.push(`• Linha ${index + 2}: campo '${campo}' está vazio`);
          }
        });

        // Se houver erros na linha, acumula; senão adiciona ao JSON limpo
        if (linhaErros.length > 0) {
          erros.push(...linhaErros);
        } else {
          jsonData.push(registro);
        }
      });

      // Exibe o resumo de validação com contagem de válidos, erros e correções
      exibirResumoValidacao(jsonData.length, erros.length, erros, correcoes);
      resolve(jsonData);
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
    renderEditableTable(jsonData);
    console.log("✅ Dados válidos:", jsonData);
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

// Converte um nome em formato Capitalizado (Ex.: "joão silva" → "João Silva")
function capitalizarNome(nome) {
  return nome
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palavra) => palavra[0].toUpperCase() + palavra.slice(1))
    .join(" ");
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
    ${
      correcoes > 0
        ? `<p><strong>🛠 Correções automáticas aplicadas:</strong> ${correcoes}</p>`
        : ""
    }
    ${
      erros.length > 0
        ? `<p><strong>Detalhes:</strong></p><ul>${erros
            .map((e) => `<li>${e}</li>`)
            .join("")}</ul>`
        : ""
    }
  `;
  summaryDiv.classList.remove("hidden");
  // Revome o "hidder" para mostrar o botão "Enviar" apenas quando não holver mais erros de validação
  if(!invalidos) {
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

  if (!data.length) return;

  const headers = Object.keys(data[0]);
  let tableHTML =
    "<table border='1' style='width:100%; border-collapse: collapse;'>";

  // Cabeçalho
  tableHTML += "<thead><tr>";
  headers.forEach((h) => {
    tableHTML += `<th style="padding: 8px; background-color: #4a8b92; color: white;">${h}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  // Linhas de dados
  data.forEach((row, rowIndex) => {
    tableHTML += "<tr>";
    headers.forEach((h) => {
      tableHTML += `<td contenteditable="true" data-row="${rowIndex}" data-key="${h}" style="padding: 6px; background-color: white; color: black;">${row[h]}</td>`;
    });
    tableHTML += "</tr>";
  });

  tableHTML += "</tbody></table>";
  tableContainer.innerHTML = tableHTML;
  tableContainer.classList.remove("hidden");
  document.getElementById("export-buttons").classList.remove("hidden");

  // Define ações dos botões de exportação
  document.getElementById("export-json").onclick = () => exportToJSON(data);
  document.getElementById("export-csv").onclick = () => exportToCSV(data);

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
}

// Exporta os dados para um arquivo JSON e inicia download
function exportToJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "dados.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Exporta os dados para CSV e inicia download
function exportToCSV(data) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map(
      (h) => `"${(row[h] || "").replace(/"/g, '""')}"`
    );
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dados_editados.csv";
  a.click();
  URL.revokeObjectURL(url);
}
