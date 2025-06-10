/**
 * Arquivo: backend/csvInsertion.js
 * Descrição: Módulo Node.js com a lógica para validar e processar os dados do CSV
 * recebidos do frontend. Este arquivo atua como a camada final de validação antes
 * de interagir com o banco de dados.
 */

// --- CONSTANTES DE VALIDAÇÃO (Autoritativas para o servidor) ---
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

// --- FUNÇÃO PRINCIPAL DO HANDLER DA ROTA ---
const inserirDadosCSV = async (req, res) => {
  const registros = req.body;
  const requiredFields = ["nome_turma", "nome_disciplina", "nome_professor", "dia_semana", "horario"];

  if (!Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ erro: "O corpo da requisição deve ser um array de registros não vazio." });
  }

  const errosDeValidacao = [];
  const registrosValidados = [];

  for (const [index, r] of registros.entries()) {
    const linhaErros = [];
    const registro = { ...r }; // Cria uma cópia para normalização

    // 1. Verificar campos obrigatórios
    for(const field of requiredFields){
        if(!registro[field] || String(registro[field]).trim() === ''){
            linhaErros.push(`Campo '${field}' é obrigatório.`);
        }
    }
    
    if(linhaErros.length > 0){
        errosDeValidacao.push({ linha: index + 1, registroOriginal: r, erros: linhaErros });
        continue; // Pula para o próximo registro
    }

    // 2. Normalização e Validação
    registro.nome_turma = registro.nome_turma.toUpperCase();
    if (!padraoTurma.test(registro.nome_turma)) {
      linhaErros.push(`Formato de 'nome_turma' inválido: "${registro.nome_turma}"`);
    }

    registro.nome_disciplina = capitalizarNome(registro.nome_disciplina);
    const disciplinaMatch = getBestMatch(registro.nome_disciplina, disciplinasPermitidas, 0.6);
    if (!disciplinaMatch) {
      linhaErros.push(`'nome_disciplina' não encontrado na lista de permitidos: "${registro.nome_disciplina}"`);
    } else {
      registro.nome_disciplina = disciplinaMatch; // Usa a versão corrigida
    }

    registro.nome_professor = capitalizarNome(registro.nome_professor);
    const professorMatch = getBestMatch(registro.nome_professor, professoresPermitidos, 0.3);
    if (!professorMatch) {
      linhaErros.push(`'nome_professor' não encontrado na lista de permitidos: "${registro.nome_professor}"`);
    } else {
      registro.nome_professor = professorMatch; // Usa a versão corrigida
    }

    const dia = parseInt(registro.dia_semana, 10);
    if (isNaN(dia) || dia < 1 || dia > 5) {
      linhaErros.push(`'dia_semana' deve ser um número entre 1 e 5: "${registro.dia_semana}"`);
    }

    const periodo = registro.nome_turma.slice(-1);
    if (!validarHorario(periodo, registro.horario)) {
      linhaErros.push(`'horario' inválido para o período (${periodo}): "${registro.horario}"`);
    }
    
    if (linhaErros.length > 0) {
        errosDeValidacao.push({ linha: index + 1, registroOriginal: r, erros: linhaErros });
    } else {
        registrosValidados.push(registro);
    }
  }

  // 3. Resposta
  if (errosDeValidacao.length > 0) {
    console.error("Validação falhou para um ou mais registros:", errosDeValidacao);
    return res.status(400).json({
      erro: "Foram encontrados dados inválidos que não puderam ser processados.",
      detalhes: errosDeValidacao,
    });
  }

  try {
    // --- PONTO DE INTEGRAÇÃO COM O BANCO DE DADOS ---
    // Aqui você faria a lógica para inserir os `registrosValidados` no seu BD.
    // Exemplo: await database.insertMany(registrosValidados);
    
    console.log(`Sucesso: ${registrosValidados.length} registros validados e prontos para inserção.`);
    
    res.status(200).json({ 
        mensagem: `Dados recebidos com sucesso. ${registrosValidados.length} registros foram processados.`,
        registrosProcessados: registrosValidados.length
    });

  } catch (dbError) {
    console.error("Erro ao inserir dados no banco:", dbError);
    res.status(500).json({ erro: "Ocorreu um erro interno no servidor ao salvar os dados." });
  }
};

// Exporta a função para ser usada nas rotas do Express (ex: em rotasTabelaCadastro.js)
module.exports = {
  inserirDadosCSV,
};