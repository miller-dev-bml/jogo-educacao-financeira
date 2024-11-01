const BACKEND_URL = 'https://literate-space-giggle-jjqwr7qwxj94hp5r4-5000.app.github.dev'; // Substitua pela sua URL real

let questoes = [];
let pontuacao = 0;
let perguntaAtual = 0;

// Elementos do DOM
const perguntaEl = document.getElementById('pergunta');
const opcoesEl = document.getElementById('opcoes');
const feedbackEl = document.getElementById('feedback');
const pontuacaoEl = document.getElementById('pontuacao');
const proximaBtn = document.getElementById('proxima');
const reiniciarBtn = document.getElementById('reiniciar'); // Novo botão
const conclusaoEl = document.getElementById('conclusao'); // Novo elemento para mensagem de conclusão

// Função para buscar questões do backend
async function buscarQuestoes() {
  console.log('Iniciando busca das questões...');
  try {
    const resposta = await fetch(`${BACKEND_URL}/api/questoes`);
    console.log('Resposta recebida:', resposta);
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    const data = await resposta.json();
    console.log('Dados das questões:', data);
    questoes = data;
    mostrarPergunta();
  } catch (error) {
    feedbackEl.textContent = 'Erro ao carregar as questões. Tente novamente mais tarde.';
    console.error('Erro ao buscar questões:', error);
  }
}

// Função para mostrar uma pergunta
function mostrarPergunta() {
  if (perguntaAtual >= questoes.length) {
    mostrarConclusao();
    return;
  }

  const questao = questoes[perguntaAtual];
  console.log('Mostrando pergunta:', questao.question);
  perguntaEl.textContent = questao.question;
  opcoesEl.innerHTML = '';

  const letras = ['a', 'b', 'c', 'd']; // Letras para identificar as opções

  questao.options.forEach((opcao, index) => {
    if (index >= letras.length) return; // Limita a 4 opções
    const letra = letras[index];
    const btn = document.createElement('button');
    btn.textContent = `${letra}) ${opcao.text}`;
    btn.classList.add('option-btn'); // Classe para estilização (opcional)
    btn.onclick = () => selecionarResposta(questao._id, letra, opcao.isCorrect, opcao.feedback);
    console.log('Adicionando opção:', opcao.text);
    opcoesEl.appendChild(btn);
  });

  feedbackEl.textContent = '';
  proximaBtn.style.display = 'none';
  reiniciarBtn.style.display = 'none'; // Garantir que o botão reiniciar está oculto durante o jogo
}

// Função para selecionar uma resposta
async function selecionarResposta(perguntaId, respostaUsuario, isCorrect, feedback) {
  console.log(`Selecionada resposta para pergunta ID: ${perguntaId}, Resposta: ${respostaUsuario}`);
  try {
    const resposta = await fetch(`${BACKEND_URL}/api/verificar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ perguntaId, respostaUsuario })
    });
    console.log('Resposta do backend:', resposta);
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    const resultado = await resposta.json();
    console.log('Resultado da verificação:', resultado);

    // Exibir o feedback específico da resposta
    feedbackEl.textContent = resultado.feedback;

    // Atualizar a pontuação com base no tipo de resposta
    if (resultado.isCorrect === true) {
      pontuacao += 10;
    } else if (resultado.isCorrect === "partial") {
      pontuacao += 5; // Valor parcial
    }

    pontuacaoEl.textContent = `Pontuação: ${pontuacao}`;
    proximaBtn.style.display = 'block';
  } catch (error) {
    feedbackEl.textContent = 'Erro ao verificar a resposta. Tente novamente.';
    console.error('Erro ao verificar resposta:', error);
  }
}

// Função para ir para a próxima pergunta
function proximaPergunta() {
  perguntaAtual++;
  mostrarPergunta();
}

// Função para mostrar a mensagem de conclusão
function mostrarConclusao() {
  perguntaEl.textContent = '';
  opcoesEl.innerHTML = '';
  feedbackEl.textContent = '';
  pontuacaoEl.textContent = `Pontuação Final: ${pontuacao}`;

  const mensagemConclusao = `
Você Aprendeu Que...
- Planejar é o Jogo: Ter um plano para juntar grana faz toda diferença! Ajuda a focar e conquistar o que você quer sem cair em roubadas.
- Grana Extra é Poder: Procurar uma renda extra e guardar direitinho mostra que você está no caminho certo! Disciplina é o caminho para chegar longe.
- Saber Dizer ‘Não’: Quando temos um objetivo, às vezes é preciso dizer “não” para gastos desnecessários. O importante é focar no que você realmente quer.
- Compromisso no Rolê: Seguir firme e não desviar da meta é o segredo do sucesso. Cada escolha conta para conquistar sua meta.
- A Espera Certa Paga Bem: Saber esperar a hora certa para comprar algo faz seu esforço valer a pena. Um bom negócio sempre aparece para quem é paciente.
  `;
  conclusaoEl.textContent = mensagemConclusao;
  conclusaoEl.style.display = 'block'; // Certifique-se de que o elemento está visível
  
  proximaBtn.style.display = 'none'; // Ocultar o botão "Próxima Pergunta"
  reiniciarBtn.style.display = 'inline-block'; // Exibir o botão "Reiniciar Jogo"
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  pontuacao = 0;
  perguntaAtual = 0;
  pontuacaoEl.textContent = `Pontuação: ${pontuacao}`;
  conclusaoEl.textContent = '';
  conclusaoEl.style.display = 'none';
  reiniciarBtn.style.display = 'none'; // Ocultar o botão "Reiniciar Jogo"
  proximaBtn.textContent = 'Próxima Pergunta';
  proximaBtn.style.display = 'none'; // Manter oculto até a próxima resposta
  mostrarPergunta();
}

// Evento do botão "Próxima Pergunta" ou "Reiniciar Jogo"
proximaBtn.addEventListener('click', function() {
  if (perguntaAtual >= questoes.length) {
    reiniciarJogo();
  } else {
    proximaPergunta();
  }
});

// Evento do botão "Reiniciar Jogo"
reiniciarBtn.addEventListener('click', reiniciarJogo);

// Inicializar o jogo
buscarQuestoes();