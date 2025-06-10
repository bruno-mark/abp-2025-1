function realizarLogin() {
    // Pega os valores dos campos
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Dados do usuário válido
    const usuarioValido = 'admin@admin.com';
    const senhaValida = 'admin123';
    
    // Remove mensagens de erro anteriores
    removerMensagemErro();
    
    // Verifica se os dados estão corretos
    if (username === usuarioValido && password === senhaValida) {
        // Login bem-sucedido
        alert('Login realizado com sucesso!');
        // Redireciona para a página principal (ajuste o caminho conforme necessário)
        window.location.href = '../html/admin.html'; // ou './home.html' - ajuste conforme sua estrutura
    } else {
        // Login falhou
        mostrarMensagemErro('Usuário ou senha incorretos!');
    }
}

function mostrarMensagemErro(mensagem) {
    // Cria elemento de erro
    const divErro = document.createElement('div');
    divErro.id = 'erro-login';
    divErro.style.cssText = `
        color: #ff0000;
        background-color: #ffe6e6;
        border: 1px solid #ff0000;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
    `;
    divErro.textContent = mensagem;
    
    // Adiciona a mensagem antes do formulário
    const form = document.querySelector('.login__form');
    form.parentNode.insertBefore(divErro, form);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        removerMensagemErro();
    }, 5000);
}

function removerMensagemErro() {
    const erroExistente = document.getElementById('erro-login');
    if (erroExistente) {
        erroExistente.remove();
    }
}

// Adiciona evento para limpar erro quando usuário começar a digitar
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.login__input');
    inputs.forEach(input => {
        input.addEventListener('input', removerMensagemErro);
    });
});