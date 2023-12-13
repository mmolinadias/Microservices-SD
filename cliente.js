const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Chave secreta para assinar e verificar o token (guarde isso em um local seguro na prática)
const secretKey = 'suaChaveSecreta';

app.post('/login', (req, res) => {
  // Autenticação básica, geralmente verifica o usuário/senha em um banco de dados
  const username = req.body.username;
  const password = req.body.password;
  console.log("username: " + username);
  console.log("password: " + password);

  if (username === 'usuario' && password === 'senha') {
    // Se a autenticação for bem-sucedida, emite um token JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Credenciais inválidas');
  }
});

app.get('/recurso-protegido', verificarToken, (req, res) => {
  // Se o token for válido, permite o acesso ao recurso protegido
  res.send('Recurso Protegido - Serviço A');
});

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
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
  console.log(`Serviço A rodando em http://localhost:${port}`);
});
