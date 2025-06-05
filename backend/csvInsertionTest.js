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
const SendButton = document.getElementById("send-button");

// Elementos do modal
const openErrorModalBtn = document.getElementById('open-error-modal'); // botão para abrir
const errorModal = document.getElementById('error-modal');      // overlay do modal
const closeErrorBtn = errorModal.querySelector('.modal-close');    // botão de fechar
const modalErrorTable = document.getElementById('modal-error-table'); // container da tabela

// 1. Variável global que mantém a última versão editada na tabela
let dadosEditados = [];
let jsonDataFinal = [];

// 2. Regex e listas de validação
const padraoTurma = /^(?:DSM-[1-5]-N|GEO-(?:1|3|5|6)-N|MA-(?:[1-3]-N|[5-6]-M))$/;

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

const horariosValidosMatutino = [
  "07:30-08:20", "08:20-09:10", "09:20-10:10",
  "10:10-11:00", "11:10-12:00", "12:00-12:50"
];
const horariosValidosNoturno = [
  "18:45-19:35", "19:35-20:25", "20:25-21:15",
  "21:25-22:15", "22:15-23:05"
];

// Funções utilitárias
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
    .map((p) => p.toLowerCase());

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

// Validar horário
function validarHorario(p, horario) {
  return p === "M"
    ? horariosValidosMatutino.includes(horario)
    : horariosValidosNoturno.includes(horario);
}

// Lê o CSV e converte em JSON, retornando uma Promise; Prá-valida as entradas
function readCSVandConvertToJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // FileReader lê o conteúdo do arquivo de forma assíncrona
    reader.onload = function (event) {
      const lines = event.target.result.trim().split("\n");
      const headers = lines[0].split(",").map(h=>h.trim());
      const required = ["nome_turma","nome_disciplina","nome_professor","dia_semana","horario"];
      const missing = required.filter(r=>!headers.includes(r));
      if(missing.length) {
        exibirMensagemDeErro(`❌ Colunas faltando: ${missing.join(", ")}`);
        esconderResumoValidacao();
        return reject(new Error("Cabeçalhos ausentes"));
      }
      esconderMensagemDeErro();

      const jsonData   = [];
      const invalidRows= [];
      const erros      = [];
      let correcoes    = 0;


      // Processa cada linha de dados (pulando o cabeçalho)
       lines.slice(1).forEach((line,idx) => {
        const values = line.split(",").map(v=>v.trim());
        const registro= headers.reduce((o,h,i)=> (o[h]=values[i]||"",o), {});
        const linhaErros = [];

        // Nome da turma
        const up = registro.nome_turma.toUpperCase();
        if(!padraoTurma.test(up)) {
          linhaErros.push(`• Formato inválido em <strong>nome_turma</strong> → "${registro.nome_turma}"`);
        } else if(registro.nome_turma !== up) {
          registro.nome_turma = up; correcoes++;
        }

        // Capitalização
        ["nome_disciplina","nome_professor"].forEach(c=>{
          const cap = capitalizarNome(registro[c]);
          if(registro[c]!==cap){ registro[c]=cap; correcoes++; }
        });

        // Correspondência aproximada
        const bestD = getBestMatch(registro.nome_disciplina, disciplinasPermitidas,0.6);
        if(bestD) { if(bestD!==registro.nome_disciplina){ registro.nome_disciplina=bestD; correcoes++; } }
        else linhaErros.push(`• Formato inválido em <strong>nome_disciplina</strong> → "${registro.nome_disciplina}"`);

        const bestP = getBestMatch(registro.nome_professor, professoresPermitidos,0.3);
        if(bestP) { if(bestP!==registro.nome_professor){ registro.nome_professor=bestP; correcoes++; } }
        else linhaErros.push(`•Formato inválido em <strong>nome_professor</strong> → "${registro.nome_professor}"`);

        // Dia da semana
        const dia = parseInt(registro.dia_semana,10);
        if(isNaN(dia)||dia<1||dia>5)
          linhaErros.push(`•Formato inválido em <strong>dia_semana</strong> → "${registro.dia_semana}"`);

        // Horário
        const periodo = up.slice(-1);
        if(!validarHorario(periodo, registro.horario))
          linhaErros.push(`• Formato inválido em <strong>horario</strong> → "${registro.horario}"`);

        // Campos obrigatórios
        ["nome_turma","nome_disciplina","nome_professor"].forEach(c=>{
          if(!registro[c]) linhaErros.push(`• Linha <strong>${idx+2}</strong>: campo <srong>'${c}'</strong> vazio`);
        });

        // Classifica registro
        if(linhaErros.length) {
          erros.push(...linhaErros);
          invalidRows.push({ ...registro, erros: linhaErros });
        } else {
          jsonData.push(registro);
        }
      });

      // 4. Depois do loop, atualiza a UI **apenas uma vez**
      exibirResumoValidacao(jsonData.length, erros.length, erros, correcoes);
      // Removido renderEditableTable(invalidRows) daqui para ser chamado apenas ao abrir o modal
      dadosEditados = invalidRows; // Guarda os dados para edição, mesmo que não seja imediatamente exibido
      resolve(jsonData);
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}


// Exibe no DOM o arquivo selecionado, executa leitura e renderiza tabela
async function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");
  fileSection.classList.remove("hidden");
  simulateProgressBar();
  removeFileButton.classList.remove("hidden");

  try {
    jsonDataFinal = await readCSVandConvertToJSON(file); // <<< Salva os dados válidos aqui

  } catch (error) {
    console.error("❌ Erro no processamento do CSV:", error.message);
  }
}


// Renderiza uma tabela editável com os dados JSON
// Agora, esta função aceita um container como argumento para ser mais flexível
function readCSVandConvertToJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const lines = event.target.result.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      const required = ["nome_turma", "nome_disciplina", "nome_professor", "dia_semana", "horario"];
      const missing = required.filter(r => !headers.includes(r));
      if (missing.length) {
        exibirMensagemDeErro(`❌ Colunas faltando: ${missing.join(", ")}`);
        esconderResumoValidacao();
        return reject(new Error("Cabeçalhos ausentes"));
      }
      esconderMensagemDeErro();

      const jsonData = [];
      const invalidRows = [];
      const errosGerais = []; // Renomeado para evitar conflito com 'erros' de linha
      let correcoes = 0;

      lines.slice(1).forEach((line, idx) => {
        const values = line.split(",").map(v => v.trim());
        const registro = headers.reduce((o, h, i) => (o[h] = { value: values[i] || "", error: false }, o), {}); // Armazena como objeto { value, error }
        const linhaErros = [];

        // Nome da turma
        const up = registro.nome_turma.value.toUpperCase();
        if (!padraoTurma.test(up)) {
          linhaErros.push(`• Linha ${idx + 2}: nome_turma inválido → "${registro.nome_turma.value}"`);
          registro.nome_turma.error = true;
        } else if (registro.nome_turma.value !== up) {
          registro.nome_turma.value = up;
          correcoes++;
        }

        // Capitalização
        ["nome_disciplina", "nome_professor"].forEach(c => {
          const cap = capitalizarNome(registro[c].value);
          if (registro[c].value !== cap) {
            registro[c].value = cap;
            correcoes++;
          }
        });

        // Correspondência aproximada
        const bestD = getBestMatch(registro.nome_disciplina.value, disciplinasPermitidas, 0.6);
        if (bestD) {
          if (bestD !== registro.nome_disciplina.value) {
            registro.nome_disciplina.value = bestD;
            correcoes++;
          }
        } else {
          linhaErros.push(`• Linha ${idx + 2}: disciplina inválida → "${registro.nome_disciplina.value}"`);
          registro.nome_disciplina.error = true;
        }

        const bestP = getBestMatch(registro.nome_professor.value, professoresPermitidos, 0.3);
        if (bestP) {
          if (bestP !== registro.nome_professor.value) {
            registro.nome_professor.value = bestP;
            correcoes++;
          }
        } else {
          linhaErros.push(`• Linha ${idx + 2}: professor inválido → "${registro.nome_professor.value}"`);
          registro.nome_professor.error = true;
        }

        // Dia da semana
        const dia = parseInt(registro.dia_semana.value, 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
          linhaErros.push(`• Linha ${idx + 2}: dia_semana inválido → "${registro.dia_semana.value}"`);
          registro.dia_semana.error = true;
        }

        // Horário
        const periodo = registro.nome_turma.value.slice(-1);
        if (!validarHorario(periodo, registro.horario.value)) {
          linhaErros.push(`• Linha ${idx + 2}: horário inválido → "${registro.horario.value}"`);
          registro.horario.error = true;
        }

        // Campos obrigatórios
        ["nome_turma", "nome_disciplina", "nome_professor"].forEach(c => {
          if (!registro[c].value) {
            linhaErros.push(`• Linha ${idx + 2}: campo '${c}' vazio`);
            registro[c].error = true;
          }
        });

        // Classifica registro
        if (linhaErros.length) {
          errosGerais.push(...linhaErros);
          invalidRows.push({ ...registro, errors: linhaErros }); // Adiciona os erros da linha
        } else {
          // Converte de volta para o formato de valor puro para dados válidos
          const validRegistro = {};
          for (const key in registro) {
            validRegistro[key] = registro[key].value;
          }
          jsonData.push(validRegistro);
        }
      });

      exibirResumoValidacao(jsonData.length, errosGerais.length, errosGerais, correcoes);
      dadosEditados = invalidRows;
      resolve(jsonData);
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}

// Modifique a função renderEditableTable para usar a nova estrutura de dados
function renderEditableTable(data, containerElement, showCheckButton = false) {
  containerElement.innerHTML = "";

  if (!data.length) {
    containerElement.classList.add("hidden");
    return;
  }

  containerElement.classList.remove("hidden");

  const headers = Object.keys(data[0]);
  let html = "<table><thead><tr>";
  // Assegura que 'errors' não seja um cabeçalho de coluna da tabela
  headers.filter(h => h !== 'errors').forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach((row, i) => {
    html += "<tr>";
    headers.filter(h => h !== 'errors').forEach(h => {
      // Adiciona a classe 'error-cell' se a propriedade 'error' for true
      const cellClass = row[h] && row[h].error ? 'error-cell' : '';
      html += `<td contenteditable class="${cellClass}" data-row="${i}" data-key="${h}">${row[h].value}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  containerElement.innerHTML = html;

  // listener de edição
  containerElement.querySelectorAll("td[contenteditable]").forEach(cell => {
    cell.addEventListener("input", () => {
      const i = +cell.dataset.row;
      const key = cell.dataset.key;
      // Atualiza o valor e remove a classe de erro ao editar
      dadosEditados[i][key].value = cell.textContent.trim();
      dadosEditados[i][key].error = false; // Remove a marcação de erro ao editar
      cell.classList.remove('error-cell'); // Remove a classe visual de erro
    });
  });

  if (showCheckButton) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Verificar Novamente";
    btn.className = "insercao__button insercao__button-verifica";
    btn.style.marginTop = "20px";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      checkTable();
    });
    containerElement.appendChild(btn);
  }
}

// Modifique a função checkTable para atualizar os estados de erro das células
function checkTable() {
  esconderMensagemDeErro();
  esconderResumoValidacao();

  const errosGerais = [];
  const validos = [];
  const invalidos = [];
  let correcoes = 0;

  // Criar uma nova estrutura para os dados revalidados, mantendo o formato { value, error }
  const revalidatedData = [];

  dadosEditados.forEach((registro, idx) => {
    const linhaErros = [];
    const linhaNum = idx + 2;
    const newRegistro = {}; // Novo objeto para a linha revalidada

    // Inicializa newRegistro com os valores atuais e sem erros (serão marcados se houver)
    for (const key in registro) {
      if (key !== 'errors') { // Não copie a propriedade 'errors' da linha
        newRegistro[key] = { value: registro[key].value, error: false };
      }
    }

    // Valida nome_turma
    const turmaUp = newRegistro.nome_turma.value.toUpperCase();
    if (!padraoTurma.test(turmaUp)) {
      linhaErros.push(`• Linha ${linhaNum}: formato inválido em 'nome_turma' → "${newRegistro.nome_turma.value}"`);
      newRegistro.nome_turma.error = true;
    } else if (newRegistro.nome_turma.value !== turmaUp) {
      newRegistro.nome_turma.value = turmaUp;
      correcoes++;
    }

    // Capitalização de campos
    ["nome_disciplina", "nome_professor"].forEach(c => {
      const cap = capitalizarNome(newRegistro[c].value.trim());
      if (newRegistro[c].value !== cap) {
        newRegistro[c].value = cap;
        correcoes++;
      }
    });

    // Correspondência aproximada
    const bestDisc = getBestMatch(newRegistro.nome_disciplina.value, disciplinasPermitidas, 0.6);
    if (bestDisc) {
      if (bestDisc !== newRegistro.nome_disciplina.value) {
        newRegistro.nome_disciplina.value = bestDisc;
        correcoes++;
      }
    } else {
      linhaErros.push(`• Linha ${linhaNum}: disciplina inválida → "${newRegistro.nome_disciplina.value}"`);
      newRegistro.nome_disciplina.error = true;
    }
    const bestProf = getBestMatch(newRegistro.nome_professor.value, professoresPermitidos, 0.3);
    if (bestProf) {
      if (bestProf !== newRegistro.nome_professor.value) {
        newRegistro.nome_professor.value = bestProf;
        correcoes++;
      }
    } else {
      linhaErros.push(`• Linha ${linhaNum}: professor inválido → "${newRegistro.nome_professor.value}"`);
      newRegistro.nome_professor.error = true;
    }

    // Dia da semana
    const dia = parseInt(newRegistro.dia_semana.value, 10);
    if (isNaN(dia) || dia < 1 || dia > 5) {
      linhaErros.push(`• Linha ${linhaNum}: dia_semana inválido → "${newRegistro.dia_semana.value}"`);
      newRegistro.dia_semana.error = true;
    }

    // Horário
    const periodo = newRegistro.nome_turma.value.slice(-1);
    if (!validarHorario(periodo, newRegistro.horario.value)) {
      linhaErros.push(`• Linha ${linhaNum}: horário inválido → "${newRegistro.horario.value}"`);
      newRegistro.horario.error = true;
    }

    // Campos obrigatórios
    ["nome_turma", "nome_disciplina", "nome_professor"].forEach(c => {
      if (!newRegistro[c].value) {
        linhaErros.push(`• Linha ${linhaNum}: campo '${c}' vazio`);
        newRegistro[c].error = true;
      }
    });

    if (linhaErros.length) {
      errosGerais.push(...linhaErros);
      invalidos.push({ ...newRegistro, errors: linhaErros });
    } else {
      const validRegistro = {};
      for (const key in newRegistro) {
        validRegistro[key] = newRegistro[key].value;
      }
      validos.push(validRegistro);
    }
    revalidatedData.push(newRegistro); // Adiciona o registro revalidado (com flags de erro)
  });

  dadosEditados = invalidos; // dadosEditados agora armazena apenas as linhas que ainda têm erros

  // Atualiza a exibição da tabela no modal (sempre com o botão Verificar Novamente)
  renderEditableTable(dadosEditados, modalErrorTable, true);

  // Mostra o resumo atualizado
  exibirResumoValidacao(validos.length, errosGerais.length, errosGerais, correcoes);

  console.log("✅ Revalidação completa. Válidos:", validos.length, "Erros:", errosGerais.length);
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
  SendButton.classList.add("hidden");  
  hideErrorModal(); // Esconder o modal ao resetar
}

// Simula um carregamento rápido de progresso
function simulateProgressBar() {
  progressFill.style.width = "0%";
  setTimeout(() => {
    progressFill.style.width = "100%";
  }, 100);
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
function exibirResumoValidacao(validos, invalidosCount, erros, correcoes = 0) {
  const summaryDiv = document.getElementById("validation-summary");
  const exportButtons = document.getElementById("export-buttons");
  const sendButton = document.getElementById("send-button"); // Adicionado para referência

  summaryDiv.innerHTML = `
    <p><strong>✅ Registros válidos:</strong> ${validos}</p>
    <p><strong>❌ Registros com erro:</strong> ${invalidosCount}</p>
    ${correcoes > 0
      ? `<p><strong>🛠 Correções automáticas aplicadas:</strong> ${correcoes}</p>`
      : ""
    }
  `;
  summaryDiv.classList.remove("hidden");
  
  // Sempre exibe o botão Remover Arquivo
  removeFileButton.classList.remove("hidden");
  
  if (invalidosCount === 0) {
    // Sem erros → mostrar Enviar, esconder Corrigir
    sendButton.classList.remove("hidden");
    exportButtons.classList.add("hidden"); // Oculta a div que contém o botão "Corrigir Erros"
  } else {
    // Com erros → mostrar Corrigir, esconder Enviar
    exportButtons.classList.remove("hidden"); // Mostra a div que contém o botão "Corrigir Erros"
    sendButton.classList.add("hidden");
  }
}


// Limpa o resumo de validação da interface
function esconderResumoValidacao() {
  const summaryDiv = document.getElementById("validation-summary");
  summaryDiv.innerHTML = "";
  summaryDiv.classList.add("hidden");
}

/**
 * Mostra o modal e insere a tabela de erros.
 */
function showErrorModal() {
  // Renderiza a tabela de erros no modal, passando dadosEditados e indicando para mostrar o botão de verificar novamente
  renderEditableTable(dadosEditados, modalErrorTable, true);
  // Exibe o overlay
  errorModal.classList.remove("hidden");
  errorModal.setAttribute("aria-hidden", "false");
}

/**
 * Esconde o modal
 */
function hideErrorModal() {
  errorModal.classList.add("hidden");
  errorModal.setAttribute("aria-hidden", "true");
}

// Abre modal ao clicar no botão
openErrorModalBtn.addEventListener("click", showErrorModal);

// Fecha modal ao clicar no botão de fechar
closeErrorBtn.addEventListener("click", hideErrorModal);

// Fecha modal ao clicar fora do conteúdo
errorModal.addEventListener("click", (e) => {
  if (e.target === errorModal) hideErrorModal();
});




SendButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Aqui você escolhe qual dado enviar:
  // Se quiser enviar apenas os registros válidos, você precisa tornar jsonData acessível aqui.
  // Para este exemplo, vamos considerar que `jsonData` é global — você pode adaptar conforme sua estrutura.

  try {
    const response = await fetch("http://localhost:3000/api/inserir-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonDataFinal), // <--- substitua aqui se necessário
    });

    const resultado = await response.json();

    if (response.ok) {
      alert("✅ Dados enviados com sucesso!");
      resetToInitialState(); // limpa a interface
    } else {
      alert("❌ Erro ao enviar dados: " + resultado.erro);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    alert("❌ Erro na comunicação com o servidor.");
  }
});
