const tabela = document.querySelector('.horario__tabela tbody');
const salvarButton = document.querySelector('.horario__botao-exportar');

const periodoSelect = document.getElementById('periodo');
const semestreSelect = document.getElementById('semestre');

//Deixar as células editavéis
function tornarEditavel() {
    tabela.querySelectorAll('tr').forEach(tr =>{
        tr.querySelectorAll('td:not(:first-child)').forEach(td => {
            td.contentEditable = true;
        });
    });
};

//Carregar dados da API
async function carregarDados() {
    const periodo = periodoSelect.value;
    const semestre = semestreSelect.value;

    const res = await fetch('http://localhost:3000/api/horario?periodo=${periodo}&semestre=${semestre}');
    const dados = await res.json();
    const linhas = tabela.querySelectorAll('tr');
    
    dados.forEach((linha, i) => {
        const tds = linhas[i].querySelectorAll('td');
        for(let j = 1; j <= tds.length; j++) {
            tds[i].innerText = linha.dias[i-1]
        };
    })
};

//Salvar dados na API
async function salvarDados() {
    const periodo = periodoSelect.value;
    const semestre = semestreSelect.value;
    const linhas = tabela.querySelectorAll('tr');
    const dados = [];

    linha.forEach((tr, i) => {
        const tds = tr.querySelectorAll('td');
        const horario = tds[0].innerText.trim();
        const dias = Array.from(tds).slice(1).map(td => td.innerText.trim());
        dados.push({horarios, dias});
    });

    const res = await fetch('http://localhost:3000/api/horario', { method: 'POST', 
        Headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({ periodo, semestre, dados})
    });

    if (res.ok) {
        alert('Horário salvo com sucesso!');
    } else {
        alert('Erro ao salvar horário');
    }
};

//Eventos
periodoSelect.addEventListener('change', carregarDados);
semestreSelect.addEventListener('change', carregarDados);
salvarButton.addEventListener('click', salvarDados);

//Inicialização 
tornarEditavel();
carregarDados(); 