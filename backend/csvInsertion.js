const dropArea = document.querySelector(".insercao__drop-area");
const fileInput = document.getElementById("file-upload");

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
  fileInput.files = e.dataTransfer.files;
});














