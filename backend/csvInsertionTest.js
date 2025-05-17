// O objeto `file` passado a `readCSVandConvertToJSON` é o File enviado pelo usuário
// (obtido de `fileInput.files[0]` ou `e.dataTransfer.files[0]`).
// Dentro da Promise, `reader.readAsText(file)` lê seu conteúdo.
// Após a resolução, a variável `jsonData` contém o array de objetos JSON resultante.

const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-upload");
const dropSection = document.getElementById("drop-section");
const fileSection = document.getElementById("file-section");
const fileNameDisplay = document.getElementById("selected-filename");
const progressFill = document.getElementById("progress-fill");
const removeFileButton = document.getElementById("remove-file");
// 🔧 Alteração: botão de envio do arquivo ao servidor
const sendFileButton = document.getElementById("send-file");

// 🔧 Alteração: variável para manter o JSON editável atual
let currentJsonData = [];

function readCSVandConvertToJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const text = event.target.result;

      // 🔧 Correção: ignora quebras de linha dentro de campos entre aspas (linhas com texto multiline)
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== "");

      // 🔧 Correção: função robusta que divide uma linha CSV considerando aspas e vírgulas internas
      const parseCSVLine = (line) => {
        const values = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++;
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      };

      const headers = parseCSVLine(lines[0]);
      const requiredHeaders = [
        "nome_turma",
        "nome_disciplina",
        "nome_professor",
        "dia_semana",
        "horario",
      ];
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

      lines.slice(1).forEach((line, index) => {
        const values = parseCSVLine(line);

        // 🔧 Correção: ignora linhas incompletas
        if (values.length < headers.length) {
          erros.push(`• Linha ${index + 2}: número insuficiente de colunas.`);
          return;
        }

        let registro = headers.reduce((obj, header, i) => {
          obj[header] = values[i] || "";
          return obj;
        }, {});

        ["nome_turma", "nome_disciplina", "nome_professor"].forEach((campo) => {
          const original = registro[campo];
          const corrigido = capitalizarNome(original.trim());
          if (original !== corrigido) {
            registro[campo] = corrigido;
            correcoes++;
          }
        });

        const linhaErros = [];

        const dia = parseInt(registro["dia_semana"], 10);
        if (isNaN(dia) || dia < 1 || dia > 5) {
          linhaErros.push(
            `• Linha ${index + 2}: valor inválido em 'dia_semana' → "${registro["dia_semana"]}"`
          );
        }

        const horarioRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
        if (!horarioRegex.test(registro["horario"])) {
          linhaErros.push(
            `• Linha ${index + 2}: formato inválido de 'horario' → "${registro["horario"]}"`
          );
        }

        ["nome_turma", "nome_disciplina", "nome_professor"].forEach((campo) => {
          if (!registro[campo]) {
            linhaErros.push(`• Linha ${index + 2}: campo '${campo}' está vazio`);
          }
        });

        if (linhaErros.length > 0) {
          erros.push(...linhaErros);
        } else {
          jsonData.push(registro);
        }
      });

      exibirResumoValidacao(jsonData.length, erros.length, erros, correcoes);
      resolve(jsonData); // jsonData é entregue ao chamar await ou .then()
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo.'));
    };

    reader.readAsText(file);
  });
}

function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");
  fileSection.classList.remove("hidden");
  simulateProgressBar();
  // 🔧 Alteração: capturar JSON e armazenar para envio
  readCSVandConvertToJSON(file).then((jsonData) => {
    currentJsonData = jsonData;
    renderEditableTable(jsonData);
    sendFileButton.classList.remove("hidden"); // mostrar botão enviar
  });
  removeFileButton.classList.remove("hidden");
}

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
  sendFileButton.classList.add("hidden"); // 🔧 ocultar botão enviar no reset
}

function simulateProgressBar() {
  progressFill.style.width = "0%";
  setTimeout(() => {
    progressFill.style.width = "100%";
  }, 100);
}

function capitalizarNome(nome) {
  return nome
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palavra) => palavra[0].toUpperCase() + palavra.slice(1))
    .join(" ");
}

// ... (demais funções exibirMensagemDeErro, exibirResumoValidacao, esconderResumoValidacao, renderEditableTable, exportToJSON, exportToCSV mantidas) ...

// 🔧 Alteração: listener do botão "Enviar arquivo" para enviar ao backend
sendFileButton.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/inserir-horarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentJsonData)
    });
    if (!response.ok) throw new Error("Falha no envio ao servidor");
    const result = await response.json();
    alert("Dados enviados com sucesso!");
  } catch (erro) {
    alert("Erro ao enviar: " + erro.message);
  }
});






// function exportToCSV(data) {
//   if (data.length === 0) return;

//   const headers = Object.keys(data[0]).join(",");
//   const rows = data.map(row => Object.values(row).join(",")).join("\n");
//   const csv = `${headers}\n${rows}`;

//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "dados.csv";
//   a.click();
//   URL.revokeObjectURL(url);
// }
