const BACKEND_URL = 'https://literate-space-giggle-jjqwr7qwxj94hp5r4-5000.app.github.dev'; // Substitua pela sua URL real

let questoes = [];
let pontuacaoTotal = 0;
let pontuacaoAtual = 0;
let perguntaAtual = 0;

// Elementos do DOM
const opcoesEl = document.getElementById('opcoes');
const feedbackEl = document.getElementById('feedback');
const pontuacaoEl = document.getElementById('pontuacao');
const proximaBtn = document.getElementById('proxima');
const reiniciarBtn = document.getElementById('reiniciar');
const conclusaoEl = document.getElementById('conclusao');

// Função para buscar questões do backend
async function buscarQuestoes() {
  try {
    const resposta = await fetch(`${BACKEND_URL}/api/questoes`);
    if (!resposta.ok) {
      throw new Error(`HTTP error! status: ${resposta.status}`);
    }
    const data = await resposta.json();
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

  pontuacaoAtual = 0;
  atualizarPontuacao();

  const questao = questoes[perguntaAtual];
  
  // Exibe as opções de resposta e adiciona a pergunta na parte superior
  opcoesEl.innerHTML = `<h2>${questao.question}</h2>`;

  const letras = ['a', 'b', 'c', 'd'];

  questao.options.forEach((opcao, index) => {
    if (index >= letras.length) return; // Limita a 4 opções
    const letra = letras[index];
    const btn = document.createElement('button');
    btn.textContent = `${letra}) ${opcao.text}`;
    btn.classList.add('option-btn');
    btn.onclick = () => selecionarResposta(opcao);
    opcoesEl.appendChild(btn);
  });

  feedbackEl.textContent = '';
  proximaBtn.style.display = 'none';
}

// Função para atualizar a pontuação total exibida
function atualizarPontuacao() {
  pontuacaoEl.textContent = `Pontuação: ${pontuacaoTotal + pontuacaoAtual}`;
}

// Função para selecionar uma resposta e atualizar a pontuação com base na última resposta escolhida
function selecionarResposta(opcaoSelecionada) {
  pontuacaoAtual = opcaoSelecionada.pontos;

  feedbackEl.classList.remove('feedback-correta', 'feedback-parcial', 'feedback-incorreta');
  feedbackEl.textContent = opcaoSelecionada.feedback;

  if (opcaoSelecionada.isCorrect === true) {
    feedbackEl.classList.add('feedback-correta');
  } else if (opcaoSelecionada.isCorrect === "partial") {
    feedbackEl.classList.add('feedback-parcial');
  } else {
    feedbackEl.classList.add('feedback-incorreta');
  }

  atualizarPontuacao();
  proximaBtn.style.display = 'block';
}

// Função para ir para a próxima pergunta
function proximaPergunta() {
  pontuacaoTotal += pontuacaoAtual;
  pontuacaoAtual = 0;
  perguntaAtual++;
  mostrarPergunta();
}

// Função para criar uma explosão de estrelas
function explosaoEstrelas() {
  const numeroEstrelas = 20; // Quantidade de estrelas na explosão

  for (let i = 0; i < numeroEstrelas; i++) {
    // Criar um elemento de estrela
    const estrela = document.createElement('div');
    estrela.classList.add('estrela-explosao');

    // Configurar posição inicial na parte inferior central da tela
    estrela.style.left = `${50 + Math.random() * 10 - 5}%`; // Pequena variação horizontal
    estrela.style.bottom = '0px';

    // Definir valores aleatórios para movimento
    const angulo = Math.random() * 360; // Ângulo aleatório em graus
    const distancia = Math.random() * 200 + 100; // Distância da explosão
    const x = Math.cos((angulo * Math.PI) / 180) * distancia;
    const y = -Math.sin((angulo * Math.PI) / 180) * distancia;

    // Definir as variáveis de CSS para os movimentos
    estrela.style.setProperty('--x', `${x}px`);
    estrela.style.setProperty('--y', `${y}px`);
    estrela.style.setProperty('--x-final', `${x / 2}px`);

    // Adicionar a estrela ao corpo do documento
    document.body.appendChild(estrela);

    // Remover a estrela do DOM após a animação
    estrela.addEventListener('animationend', () => {
      estrela.remove();
    });
  }
}

// Função para mostrar a mensagem de conclusão
function mostrarConclusao() {
  opcoesEl.innerHTML = '';
  feedbackEl.textContent = '';
  pontuacaoEl.textContent = `Pontuação Final: ${pontuacaoTotal}`;

  const mensagemConclusao = `
Você Aprendeu Que...
- Planejar é o Jogo: Ter um plano para juntar grana faz toda diferença! Ajuda a focar e conquistar o que você quer sem cair em roubadas.
- Grana Extra é Poder: Procurar uma renda extra e guardar direitinho mostra que você está no caminho certo! Disciplina é o caminho para chegar longe.
- Saber Dizer ‘Não’: Quando temos um objetivo, às vezes é preciso dizer “não” para gastos desnecessários. O importante é focar no que você realmente quer.
- Compromisso no Rolê: Seguir firme e não desviar da meta é o segredo do sucesso. Cada escolha conta para conquistar sua meta.
- A Espera Certa Paga Bem: Saber esperar a hora certa para comprar algo faz seu esforço valer a pena. Um bom negócio sempre aparece para quem é paciente.
  `;
  conclusaoEl.textContent = mensagemConclusao;
  conclusaoEl.style.display = 'block';

  proximaBtn.style.display = 'none';
  reiniciarBtn.style.display = 'inline-block';

  // Iniciar a explosão de estrelas
  explosaoEstrelas();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  pontuacaoTotal = 0;
  pontuacaoAtual = 0;
  perguntaAtual = 0;
  atualizarPontuacao();
  conclusaoEl.textContent = '';
  conclusaoEl.style.display = 'none';
  reiniciarBtn.style.display = 'none';
  mostrarPergunta();
}

// Evento do botão "Próxima Pergunta"
proximaBtn.addEventListener('click', proximaPergunta);

// Evento do botão "Reiniciar Jogo"
reiniciarBtn.addEventListener('click', reiniciarJogo);

// Inicializar o jogo
buscarQuestoes();
