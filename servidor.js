const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();
const port = 4000;

const secretKey = 'suaChaveSecreta';

app.post('/login', async (req, res) => {
  // Autenticação básica, geralmente verifica o usuário/senha em um banco de dados
  const username = req.body.username;
  const password = req.body.password;

  if (username === 'usuario' && password === 'senha') {
    // Se a autenticação for bem-sucedida, emite um token JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

app.get('/recurso-protegido', verificarToken, async (req, res) => {
  // Se o token for válido, permite o acesso ao recurso protegido e chama o Serviço A
  try {
    const response = await axios.get('http://localhost:4000/recurso-protegido', {
      headers: { Authorization: req.headers.authorization },
    });
    res.send(`Recurso Protegido - Serviço B - ${response.data}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao chamar o Serviço A');
  }
});

function verificarToken(req, res, next) {
    // Extrai o token do cabeçalho de autorização
    const bearerHeader = req.headers['authorization'];
  
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const token = bearer[1];
  
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log("token: " + token);
          console.log("secretKey: " + secretKey);
          return res.status(403).send('Token inválido');
        }
        req.decoded = decoded;
        next();
      });
    } else {
      res.status(401).send('Token não fornecido');
    }
  }

app.listen(port, () => {
  console.log(`Serviço B rodando em http://localhost:${port}`);
});
