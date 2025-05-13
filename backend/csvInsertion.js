const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-upload");
const dropSection = document.getElementById("drop-section");
const fileSection = document.getElementById("file-section");
const fileNameDisplay = document.getElementById("selected-filename");
const progressFill = document.getElementById("progress-fill");
const removeFileButton = document.getElementById("remove-file");

function showSelectedFile(file) {
  fileNameDisplay.textContent = `📄 ${file.name}`;
  dropSection.classList.add("hidden");
  fileSection.classList.remove("hidden");
  simulateProgressBar();
  readCSVandConvertToJSON(file);
}

function resetToInitialState() {
  fileInput.value = "";
  dropSection.classList.remove("hidden");
  fileSection.classList.add("hidden");
  progressFill.style.width = "0%";
}

function simulateProgressBar() {
  progressFill.style.width = "0%";
  setTimeout(() => {
    progressFill.style.width = "100%";
  }, 100);
}
function exibirMensagemDeErro(mensagem) {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = mensagem;
  errorDiv.classList.remove("hidden");
}

function esconderMensagensDeErro() {
  const errorDiv = document.getElementById("error-messages");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

function readCSVandConvertToJSON(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    const lines = text.trim().split("\n");

    const headers = lines[0].split(",").map((h) => h.trim());
    const requiredHeaders = [
      "turma",
      "disciplina",
      "professor",
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
      return;
    }

    esconderMensagensDeErro(); // caso tudo esteja certo

    const jsonData = [];
    const erros = [];

    lines.slice(1).forEach((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      const registro = headers.reduce((obj, header, i) => {
        obj[header] = values[i] || "";
        return obj;
      }, {});

      // Validação por linha
      const linhaErros = [];

      // dia_semana: deve estar entre 1 e 5
      const dia = parseInt(registro["dia_semana"], 10);
      if (isNaN(dia) || dia < 1 || dia > 5) {
        linhaErros.push(
          `Linha ${index + 2}: valor inválido em 'dia_semana' (${
            registro["dia_semana"]
          })`
        );
      }

      // horario: deve estar no formato HH:MM-HH:MM
      const horarioRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
      if (!horarioRegex.test(registro["horario"])) {
        linhaErros.push(
          `Linha ${index + 2}: formato inválido de 'horario' (${
            registro["horario"]
          })`
        );
      }

      // Outros campos obrigatórios não podem estar vazios
      ["turma", "disciplina", "professor"].forEach((campo) => {
        if (!registro[campo]) {
          linhaErros.push(
            `Linha ${index + 2}: campo obrigatório '${campo}' está vazio`
          );
        }
      });

      if (linhaErros.length > 0) {
        erros.push(...linhaErros);
      } else {
        jsonData.push(registro);
      }
    });

    if (erros.length > 0) {
      exibirMensagemDeErro(
        "⚠️ Problemas encontrados no arquivo:\n\n" + erros.join("\n")
      );
    } else {
      esconderMensagensDeErro();
      console.log("✅ Dados válidos:", jsonData);
      // Aqui segue para o próximo passo, como exibir ou salvar
    }

    // Aqui você pode continuar o processamento, validação de linhas, etc.
  };
  reader.readAsText(file);
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
