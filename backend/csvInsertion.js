const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-upload");
const dropSection = document.getElementById("drop-section");
const fileSection = document.getElementById("file-section");
const fileNameDisplay = document.getElementById("selected-filename");
const progressFill = document.getElementById("progress-fill");
const removeFileButton = document.getElementById("remove-file");

const jsonDataGlobal = [];


function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");
  fileSection.classList.remove("hidden");
  simulateProgressBar();
  readCSVandConvertToJSON(file);
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

function readCSVandConvertToJSON(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    const lines = text.trim().split("\n");

    const headers = lines[0].split(",").map((h) => h.trim());
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
        `❌ O arquivo está com colunas faltando: ${missingHeaders.join(
          ", "
        )}. Corrija antes de prosseguir.`
      );
      esconderResumoValidacao();
      return;
    }

    esconderMensagemDeErro();

    const jsonData = [];
    const erros = [];
    let correcoes = 0;

    lines.slice(1).forEach((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      let registro = headers.reduce((obj, header, i) => {
        obj[header] = values[i] || "";
        return obj;
      }, {});

      // Correções automáticas
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
          `• Linha ${index + 2}: valor inválido em 'dia_semana' → "${
            registro["dia_semana"]
          }"`
        );
      }

      const horarioRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
      if (!horarioRegex.test(registro["horario"])) {
        linhaErros.push(
          `• Linha ${index + 2}: formato inválido de 'horario' → "${
            registro["horario"]
          }"`
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
    renderEditableTable(jsonData);

    console.log("✅ Dados válidos:", jsonData);
    jsonDataGlobal.push(jsonData);

    
    console.log("Olá: ", jsonDataGlobal[0][0].nome_disciplina);



  };

  reader.readAsText(file);
}

function exibirMensagemDeErro(mensagem) {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = mensagem;
  errorDiv.classList.remove("hidden");
}

function esconderMensagemDeErro() {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

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
}

function esconderResumoValidacao() {
  const summaryDiv = document.getElementById("validation-summary");
  summaryDiv.innerHTML = "";
  summaryDiv.classList.add("hidden");
}

dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#4a8b92";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "#5B9EA6";
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

  document.getElementById("export-json").onclick = () => exportToJSON(data);
  document.getElementById("export-csv").onclick = () => exportToCSV(data);

  // Atualiza o JSON ao editar células
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

function exportToJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dados_editados.json";
  a.click();
  URL.revokeObjectURL(url);
}

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
