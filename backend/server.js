const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuração de CORS
app.use(cors({
  origin: '*' // Para desenvolvimento, permita todas as origens. Para produção, especifique a URL do frontend.
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Rota de Teste
app.get('/', (req, res) => {
  res.send('Servidor Backend está funcionando!');
});

// Rota para obter todas as questões
app.get('/api/questoes', (req, res) => {
  console.log('Requisição recebida em /api/questoes');
  const filePath = path.join(__dirname, 'data', 'questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler questions.json:', err);
      return res.status(500).json({ mensagem: 'Erro ao ler as questões.' });
    }
    try {
      const questoes = JSON.parse(data);
      res.json(questoes);
    } catch (parseErr) {
      console.error('Erro ao parsear questions.json:', parseErr);
      res.status(500).json({ mensagem: 'Erro ao processar as questões.' });
    }
  });
});

// Rota para verificar a resposta
app.post('/api/verificar', (req, res) => {
  console.log('Requisição recebida em /api/verificar');
  const { perguntaId, respostaUsuario } = req.body;
  console.log(`Pergunta ID: ${perguntaId}, Resposta Usuário: ${respostaUsuario}`);

  const filePath = path.join(__dirname, 'data', 'questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler questions.json:', err);
      return res.status(500).json({ mensagem: 'Erro ao ler as questões.' });
    }
    try {
      const questoes = JSON.parse(data);
      // Use _id para encontrar a questão
      const questao = questoes.find(q => q._id === perguntaId);

      if (!questao) {
        console.warn(`Questão com ID ${perguntaId} não encontrada.`);
        return res.status(404).json({ mensagem: 'Questão não encontrada.' });
      }

      // Converter respostaUsuario ('a', 'b', 'c', 'd') para índice
      const letras = ['a', 'b', 'c', 'd'];
      const indice = letras.indexOf(respostaUsuario.toLowerCase());

      if (indice === -1 || indice >= questao.options.length) {
        console.warn(`Opção selecionada inválida: ${respostaUsuario}`);
        return res.status(400).json({ mensagem: 'Opção selecionada inválida.' });
      }

      const opcaoSelecionada = questao.options[indice];

      res.json({
        isCorrect: opcaoSelecionada.isCorrect,
        feedback: opcaoSelecionada.feedback
      });
    } catch (parseErr) {
      console.error('Erro ao parsear questions.json:', parseErr);
      res.status(500).json({ mensagem: 'Erro ao processar as questões.' });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
