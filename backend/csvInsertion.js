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
