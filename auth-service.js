const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const port = 3000;
const secretKey = 'seuSegredoSuperSecreto';
const passwordServiceUrl = 'http://localhost:3001';

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  console.log(`Usuário registrado: ${username}`);
  
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  
  try {
    await axios.post(`${passwordServiceUrl}/register-user`, { username, token });
    res.json({ message: 'Usuário registrado com sucesso', token });
  } catch (error) {
    console.error('Erro ao chamar o microsserviço de alteração de senha:', error.message);
    res.status(500).json({ message: 'Erro ao registrar o usuário' });
  }
});

app.listen(port, () => {
  console.log(`Microsserviço de Registro rodando na porta ${port}`);
});
