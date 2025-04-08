document.addEventListener("DOMContentLoaded", function(){
    // Seleciona o botão e os ícones
    const btnAlternate = document.querySelector(".header__alternate-modes");
    const darkIcon = document.querySelector(".header__icon--dark");
    const lightIcon = document.querySelector(".header__icon--light");

// Adiciona um evento de clique no botão
btnAlternate.addEventListener("click", function(){
    // Se o ícone de dark mode estiver oculto, significa que o light mode está ativo.
    if (darkIcon.style.display === "none" || window.getComputedStyle(darkIcon).display === "none") {
    // Mostra o dark mode e esconde o light mode
    darkIcon.style.display = "flex";
    lightIcon.style.display = "none";
    } else {
    // Caso contrário, esconde o dark mode e mostra o light mode
    darkIcon.style.display = "none";
    lightIcon.style.display = "flex";
    }
});
});