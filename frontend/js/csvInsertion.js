/**
 * Arquivo: frontend/js/csvInsertion.js
 * Descrição: Gerencia a interação do usuário com a página de inserção de CSV,
 * incluindo drag-and-drop, leitura do arquivo, validação inicial para feedback
 * rápido, e o envio dos dados validados para o backend.
 */

// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-upload");
const dropSection = document.getElementById("drop-section");
const fileSection = document.getElementById("file-section");
const fileNameDisplay = document.getElementById("selected-filename");
const progressFill = document.getElementById("progress-fill");
const removeFileButton = document.getElementById("remove-file");
const sendButton = document.getElementById("send-button");

// Elementos do modal de erro
const openErrorModalBtn = document.getElementById('open-error-modal');
const errorModal = document.getElementById('error-modal');
const closeErrorBtn = errorModal.querySelector('.modal-close');
const modalErrorTable = document.getElementById('modal-error-table');

// --- ESTADO GLOBAL DO FRONTEND ---
let dadosEditados = []; // Mantém a versão mais recente dos dados com erro para edição
let jsonDataFinal = []; // Mantém os dados válidos prontos para envio

// --- CONSTANTES DE VALIDAÇÃO (duplicadas do backend para feedback imediato) ---
const padraoTurma = /^(?:DSM-[1-5]-N|GEO-(?:1|3|5|6)-N|MA-(?:[1-3]-N|[5-6]-M))$/;
const disciplinasPermitidas = [
  "Engenharia de Software I", "Modelagem de Banco de Dados", "Algoritmo", "Sistemas Operacionais e Redes de Computadores",
  "Desenvolvimento Web I", "Design Digital", "Técnicas de Programação I", "Desenvolvimento Web II", "Matemática para Computação",
  "Estrutura de Dados", "Engenharia de Software II", "Banco de Dados Relacional", "Banco de Dados não Relacional",
  "Gestão Ágil de Projetos de Software", "Álgebra Linear", "Técnicas de Programação II", "Desenvolvimento Web III",
  "Interação Humano Computador", "Inglês I", "Programação para Dispositivos Móveis I", "Laboratório de Desenvolvimento Web",
  "Internet das Coisas e Aplicações", "Estatística Aplicada", "Integração e Entrega Contínua", "Experiência do Usuário", "Inglês II",
  "Segurança no Desenvolvimento de Aplicações", "Aprendizagem de Máquina", "Computação em Nuvem I",
  "Laboratório de Desenvolvimento para Dispositivos Móveis", "Programação para Dispositivos Móveis II", "Fundamentos da Redação Técnica",
  "Inglês III", "Introdução à Ciência da Geoinformação", "Desenho Técnico", "Algoritmos e Lógica de Programação", "Cálculo",
  "Metodologia", "Comunicação", "Fundamentos de Física", "Estatística", "Topografia e Batimetria", "Geodésia", "Processamento Digital de Imagens",
  "Linguagem de Programação II", "Análise Ambiental", "WebGIS", "Análise Espacial e Modelagem Territorial", "Infraestrutura Urbana",
  "Fundamentos da Administração", "Projetos 1", "Legislação", "Inglês V", "Posicionamento por Satélite", "Cadastro Técnico Multifinalitário",
  "Integração e Análise de Dados Territoriais", "Projetos 2", "Padrões Distribuídos de Dados em SIG", "Fotogrametria Analógica e Digital",
  "Geomarketing", "Georreferenciamento de Imóveis Rurais", "Inglês VI", "Ciências Ambientais e das Águas", "Química Geral", "Biologia",
  "Matemática Aplicada", "Fundamentos da Comunicação Empresarial", "Sociologia Ambiental", "Geociência Ambiental",
  "Cartografia, Topografia e Batimetria", "Microbiologia", "Hidrologia e Recursos Hídricos", "SERE", "Físico-Química Ambiental",
  "Ecologia", "Climatologia e Meteorologia", "Hidráulica Fluvial", "Gestão da Qualidade", "Saneamento Ambiental I",
  "Planejamento e Conservação Ambiental", "IPDI", "Legislação Ambiental", "Planejamento e Gestão Urbana", "Projetos Ambientais 1",
  "Gerenciamento de Resíduos", "Controle e Monitoramento da Poluição Atmosférica", "Ecotecnologia", "Águas Subterrâneas",
  "Sistemas de Gestão e Auditoria Ambiental", "Revitalização de Rios e Recuperação de Nascentes", "Energias Alternativas", "Projetos Ambientais 2",
  "Turismo e Meio Ambiente e Recursos Hídricos", "Planejamento de Bacias Hidrográficas"
];
const professoresPermitidos = [
  "Prof. Me. Antonio Egydio São Thiago Graça", "Prof. Dr. Arley Ferreira de Souza", "Prof. Esp. Marcelo Augusto Sudo", "Prof. Esp. André Olímpio",
  "Prof. Dr. Fabrício Galende Marques de Carvalho", "Prof. Esp. Henrique Duarte Borges Louro", "Profa. Esp. Lucineide Nunes Pimenta",
  "Profa. Ma. Adriana Antividad López Valverde", "Profa. Dra. Rita de Cássia Silva Von Randow", "Prof. Me. Ronaldo Emerick Moreira",
  "Prof. Esp. Neymar Siqueira Dellareti", "Profa. Esp. Maria Lucia de Oliveira", "Prof. Me. Rodrigo Monteiro de Barros Santana",
  "Profa. Esp. Joanize Aparecida dos Santos Mohallem Paiva", "Prof. Me. Celso de Oliveira", "Profa. Dra. Karen Espinosa",
  "Prof. Dr. Daniel José de Andrade", "Prof. Esp. Mariana Timponi Rodrigues", "Profa. Dra. Vivian Hyodo", "Prof. Me. Adilson Rodolfo Neves",
  "Prof. Msc. Jane Delane Verona", "Profa. Ma. Yara da Cruz Ferreira", "Prof. Dr. Nilton de Jesus", "Profa. Msc. Risleide Lucia dos Santos",
  "Prof. Esp. Matheus de Oliveira Lorena", "Prof. M.Sc. Mario Sérgio Soléo Scalambrino", "Prof. M.Sc. Luiz Gustavo Galhardo Mendes",
  "Prof. M.Sc. Kenji Taniguchi", "Prof. M.Sc. Luiz Sérgio Gonçalves Aguiar", "Prof. M.Sc. Paulo José Maria Filho",
  "Profa. M.Sc. Fernanda da Silveira Bueno", "Prof. Dr. Renato Mortin", "Prof. Me. Gerson Freitas Júnior", "Prof. Me. Wellington Rios",
  "Prof. Dr. Érico Luciano Pagotto", "Prof. Dr. Jorge Tadao Matsushima", "Profa. Dra. Sanzara Nhiaia J.C. Hassmann",
  "Profa. Dra. Selma Candelária Genari", "Profa. Dra. Rita de Cássia von Randow", "Profa. Dra. Nanci de Oliveira", "Prof. Dr. Daniel",
  "A definir", "Sem professor", "Sem docente"
];
const horariosValidosMatutino = ["07:30-08:20", "08:20-09:10", "09:20-10:10", "10:10-11:00", "11:10-12:00", "12:00-12:50"];
const horariosValidosNoturno = ["18:45-19:35", "19:35-20:25", "20:25-21:15", "21:25-22:15", "22:15-23:05"];

// --- FUNÇÕES UTILITÁRIAS DE STRING E SIMILARIDADE ---
function capitalizarNome(texto) {
  const conectivos = ['de', 'do', 'da', 'dos', 'das', 'e', 'a', 'o', 'os', 'as', 'à', 'ao', 'aos', 'às', 'para', 'por', 'com', 'sem', 'sob', 'sobre', 'entre', 'contra', 'perante', 'segundo', 'conforme', 'via', 'até'];
  const romanos = ['i', 'ii', 'iii', 'iv'];
  const palavras = texto.trim().split(/\s+/).map((p) => p.toLowerCase());
  return palavras.map((palavra, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === palavras.length - 1;
    if (isLast && romanos.includes(palavra)) return palavra.toUpperCase();
    if (isFirst) return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    if (conectivos.includes(palavra)) return palavra;
    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
  }).join(' ');
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function similarity(a, b) {
  const dist = levenshtein(a.trim(), b.trim());
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - dist / maxLen;
}

function getBestMatch(input, list, threshold = 0.6) {
  let best = { item: null, score: 0 };
  list.forEach((candidate) => {
    const score = similarity(input, candidate);
    if (score > best.score) best = { item: candidate, score };
  });
  return best.score >= threshold ? best.item : null;
}

function validarHorario(p, horario) {
  return p === "M" ? horariosValidosMatutino.includes(horario) : horariosValidosNoturno.includes(horario);
}


// --- LÓGICA DE PROCESSAMENTO E VALIDAÇÃO DO CSV ---
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
      const errosGerais = [];
      let correcoes = 0;

      lines.slice(1).forEach((line, idx) => {
        const values = line.split(",").map(v => v.trim());
        const registro = headers.reduce((o, h, i) => (o[h] = { value: values[i] || "", error: false }, o), {});
        const linhaErros = [];

        // Validações...
        const up = registro.nome_turma.value.toUpperCase();
        if (!padraoTurma.test(up)) {
          linhaErros.push(`• Linha ${idx + 2}: nome_turma inválido → "${registro.nome_turma.value}"`);
          registro.nome_turma.error = true;
        } else if (registro.nome_turma.value !== up) {
          registro.nome_turma.value = up; correcoes++;
        }

        ["nome_disciplina", "nome_professor"].forEach(c => {
          const cap = capitalizarNome(registro[c].value);
          if (registro[c].value !== cap) { registro[c].value = cap; correcoes++; }
        });

        const bestD = getBestMatch(registro.nome_disciplina.value, disciplinasPermitidas, 0.6);
        if (bestD) { if (bestD !== registro.nome_disciplina.value) { registro.nome_disciplina.value = bestD; correcoes++; }
        } else {
          linhaErros.push(`• Linha ${idx + 2}: disciplina inválida → "${registro.nome_disciplina.value}"`);
          registro.nome_disciplina.error = true;
        }

        const bestP = getBestMatch(registro.nome_professor.value, professoresPermitidos, 0.3);
        if (bestP) { if (bestP !== registro.nome_professor.value) { registro.nome_professor.value = bestP; correcoes++; }
        } else {
          linhaErros.push(`• Linha ${idx + 2}: professor inválido → "${registro.nome_professor.value}"`);
          registro.nome_professor.error = true;
        }

        const dia = parseInt(registro.dia_semana.value, 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
          linhaErros.push(`• Linha ${idx + 2}: dia_semana inválido → "${registro.dia_semana.value}"`);
          registro.dia_semana.error = true;
        }

        const periodo = registro.nome_turma.value.slice(-1);
        if (!validarHorario(periodo, registro.horario.value)) {
          linhaErros.push(`• Linha ${idx + 2}: horário inválido → "${registro.horario.value}"`);
          registro.horario.error = true;
        }

        required.forEach(c => {
          if (!registro[c].value) {
            linhaErros.push(`• Linha ${idx + 2}: campo '${c}' vazio`);
            registro[c].error = true;
          }
        });

        if (linhaErros.length) {
          errosGerais.push(...linhaErros);
          invalidRows.push({ ...registro, errors: linhaErros });
        } else {
          const validRegistro = {};
          for (const key in registro) validRegistro[key] = registro[key].value;
          jsonData.push(validRegistro);
        }
      });

      exibirResumoValidacao(jsonData.length, errosGerais.length, correcoes);
      dadosEditados = invalidRows;
      resolve(jsonData);
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}

// --- MANIPULAÇÃO DA UI (VISUAL) ---
async function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");
  fileSection.classList.remove("hidden");
  simulateProgressBar();
  removeFileButton.classList.remove("hidden");

  try {
    jsonDataFinal = await readCSVandConvertToJSON(file); // Salva dados válidos na variável global
  } catch (error) {
    console.error("❌ Erro no processamento do CSV:", error.message);
  }
}

function renderEditableTable(data, containerElement, showCheckButton = false) {
  containerElement.innerHTML = "";
  if (!data.length) {
    containerElement.classList.add("hidden");
    return;
  }
  containerElement.classList.remove("hidden");

  const headers = Object.keys(data[0]);
  let html = "<table><thead><tr>";
  headers.filter(h => h !== 'errors').forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach((row, i) => {
    html += "<tr>";
    headers.filter(h => h !== 'errors').forEach(h => {
      const cellClass = row[h] && row[h].error ? 'error-cell' : '';
      html += `<td contenteditable class="${cellClass}" data-row="${i}" data-key="${h}">${row[h].value}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  containerElement.innerHTML = html;

  containerElement.querySelectorAll("td[contenteditable]").forEach(cell => {
    cell.addEventListener("input", () => {
      const i = +cell.dataset.row;
      const key = cell.dataset.key;
      dadosEditados[i][key].value = cell.textContent.trim();
      dadosEditados[i][key].error = true;
      cell.classList.remove('error-cell');
    });
  });

  if (showCheckButton) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Verificar Novamente";
    btn.className = "insercao__button insercao__button-verifica";
    btn.style.marginTop = "20px";
    btn.addEventListener("click", (e) => { e.preventDefault(); checkTable(); });
    containerElement.appendChild(btn);
  }
}

function checkTable() {
    esconderMensagemDeErro();
    esconderResumoValidacao();

    const errosGerais = [];
    const validos = [];
    const invalidos = [];
    let correcoes = 0;
    const revalidatedData = [];

    dadosEditados.forEach((registro, idx) => {
        const linhaErros = [];
        const linhaNum = idx + 2; // Simula o número da linha no arquivo original
        const newRegistro = {};

        for (const key in registro) {
            if (key !== 'errors') {
                newRegistro[key] = { value: registro[key].value, error: false };
            }
        }

        // Re-validações...
        const turmaUp = newRegistro.nome_turma.value.toUpperCase();
        if (!padraoTurma.test(turmaUp)) {
            linhaErros.push(`• Linha ${linhaNum}: formato inválido em 'nome_turma' → "${newRegistro.nome_turma.value}"`);
            newRegistro.nome_turma.error = true;
        } else if (newRegistro.nome_turma.value !== turmaUp) {
            newRegistro.nome_turma.value = turmaUp; correcoes++;
        }

        ["nome_disciplina", "nome_professor"].forEach(c => {
            const cap = capitalizarNome(newRegistro[c].value.trim());
            if (newRegistro[c].value !== cap) { newRegistro[c].value = cap; correcoes++; }
        });

        const bestDisc = getBestMatch(newRegistro.nome_disciplina.value, disciplinasPermitidas, 0.6);
        if (bestDisc) { if (bestDisc !== newRegistro.nome_disciplina.value) { newRegistro.nome_disciplina.value = bestDisc; correcoes++; }
        } else {
            linhaErros.push(`• Linha ${linhaNum}: disciplina inválida → "${newRegistro.nome_disciplina.value}"`);
            newRegistro.nome_disciplina.error = true;
        }

        const bestProf = getBestMatch(newRegistro.nome_professor.value, professoresPermitidos, 0.3);
        if (bestProf) { if (bestProf !== newRegistro.nome_professor.value) { newRegistro.nome_professor.value = bestProf; correcoes++; }
        } else {
            linhaErros.push(`• Linha ${linhaNum}: professor inválido → "${newRegistro.nome_professor.value}"`);
            newRegistro.nome_professor.error = true;
        }
        
        const dia = parseInt(newRegistro.dia_semana.value, 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
            linhaErros.push(`• Linha ${linhaNum}: dia_semana inválido → "${newRegistro.dia_semana.value}"`);
            newRegistro.dia_semana.error = true;
        }

        const periodo = newRegistro.nome_turma.value.slice(-1);
        if (!validarHorario(periodo, newRegistro.horario.value)) {
            linhaErros.push(`• Linha ${linhaNum}: horário inválido → "${newRegistro.horario.value}"`);
            newRegistro.horario.error = true;
        }
        
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
            for (const key in newRegistro) validRegistro[key] = newRegistro[key].value;
            validos.push(validRegistro);
        }
        revalidatedData.push(newRegistro);
    });
    
    // Adiciona os registros recém-validados ao `jsonDataFinal`
    jsonDataFinal.push(...validos);
    dadosEditados = invalidos; // Atualiza a lista de erros para os que restaram

    renderEditableTable(dadosEditados, modalErrorTable, true);
    exibirResumoValidacao(jsonDataFinal.length, errosGerais.length, correcoes);
    
    // Se não houver mais erros, fecha o modal e mostra o botão de enviar
    if(invalidos.length === 0){
        hideErrorModal();
    }
}


function resetToInitialState() {
  fileInput.value = "";
  dropSection.classList.remove("hidden");
  fileSection.classList.add("hidden");
  progressFill.style.width = "0%";
  esconderMensagemDeErro();
  esconderResumoValidacao();
  removeFileButton.classList.add("hidden");
  document.getElementById("export-buttons").classList.add("hidden");
  sendButton.classList.add("hidden");
  hideErrorModal();
  jsonDataFinal = [];
  dadosEditados = [];
}

function simulateProgressBar() {
  progressFill.style.width = "0%";
  setTimeout(() => { progressFill.style.width = "100%"; }, 100);
}

function exibirMensagemDeErro(mensagem) {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.innerHTML = mensagem;
  errorDiv.classList.remove("hidden");
}

function esconderMensagemDeErro() {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

function exibirResumoValidacao(validosCount, invalidosCount, correcoes = 0) {
    const summaryDiv = document.getElementById("validation-summary");
    const exportButtons = document.getElementById("export-buttons");

    summaryDiv.innerHTML = `
      <p><strong>✅ Registros válidos:</strong> ${validosCount}</p>
      <p><strong>❌ Registros com erro:</strong> ${invalidosCount}</p>
      ${correcoes > 0 ? `<p><strong>🛠 Correções automáticas:</strong> ${correcoes}</p>` : ""}
    `;
    summaryDiv.classList.remove("hidden");
    removeFileButton.classList.remove("hidden");

    if (invalidosCount === 0 && validosCount > 0) {
        sendButton.classList.remove("hidden");
        exportButtons.classList.add("hidden");
    } else {
        exportButtons.classList.remove("hidden");
        sendButton.classList.add("hidden");
    }
}


function esconderResumoValidacao() {
  const summaryDiv = document.getElementById("validation-summary");
  summaryDiv.innerHTML = "";
  summaryDiv.classList.add("hidden");
}

function showErrorModal() {
  renderEditableTable(dadosEditados, modalErrorTable, true);
  errorModal.classList.remove("hidden");
  errorModal.setAttribute("aria-hidden", "false");
}

function hideErrorModal() {
  // Se o foco estiver dentro do modal, remove
  if (errorModal.contains(document.activeElement)) {
    document.activeElement.blur(); // ou: document.body.focus();
  }

  errorModal.classList.add("hidden");
  errorModal.setAttribute("aria-hidden", "true");
}



// --- EVENT LISTENERS ---
dropArea.addEventListener("click", () => fileInput.click());
dropArea.addEventListener("dragover", (e) => { e.preventDefault(); dropArea.style.backgroundColor = "#4a8b92"; });
dropArea.addEventListener("dragleave", () => { dropArea.style.backgroundColor = "#5B9EA6"; });
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
openErrorModalBtn.addEventListener("click", showErrorModal);
closeErrorBtn.addEventListener("click", hideErrorModal);
errorModal.addEventListener("click", (e) => { if (e.target === errorModal) hideErrorModal(); });

sendButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (jsonDataFinal.length === 0) {
      alert("Nenhum dado válido para enviar.");
      return;
  }
  
  try {
    const response = await fetch("http://localhost:3000/api/inserir-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonDataFinal),
    });
    const resultado = await response.json();
    if (response.ok) {
      alert("✅ Dados enviados com sucesso!");
      resetToInitialState();
    } else {
      alert("❌ Erro ao enviar dados: " + (resultado.erro || "Erro desconhecido."));
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    alert("❌ Erro na comunicação com o servidor.");
  }
});