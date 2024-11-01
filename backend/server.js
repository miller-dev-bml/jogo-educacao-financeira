const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor Backend está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const fs = require('fs');
const path = require('path');

// Rota para obter todas as questões
app.get('/api/questoes', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao ler as questões.' });
    }
    const questoes = JSON.parse(data);
    res.json(questoes);
  });
});

// Rota para verificar a resposta
app.post('/api/verificar', (req, res) => {
    const { perguntaId, respostaUsuario } = req.body;
  
    const filePath = path.join(__dirname, 'data', 'questions.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao ler as questões.' });
      }
      const questoes = JSON.parse(data);
      const questao = questoes.find(q => q.id === perguntaId);
  
      if (!questao) {
        return res.status(404).json({ mensagem: 'Questão não encontrada.' });
      }
  
      const estaCorreta = questao.resposta.toLowerCase() === respostaUsuario.toLowerCase();
  
      res.json({ correta: estaCorreta, respostaCorreta: questao.resposta });
    });
  });
  