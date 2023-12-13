const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const secretKey = 'seuSegredoSuperSecreto';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register-user', (req, res) => {
  const { username, token } = req.body;

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    console.log(`Usuário registrado no microsserviço de alteração de senha: ${user.username}`);
    
    res.json({ message: 'Usuário registrado com sucesso no microsserviço de alteração de senha' });
  });
});

app.put('/change-password', authenticateToken, authenticateUser, (req, res) => {
  const { username, newPassword } = req.body;
  
  console.log(`Senha alterada para o usuário ${username}: ${newPassword}`);
  
  res.json({ message: 'Senha alterada com sucesso' });
});

function authenticateUser(req, res, next) {
  const { username, password } = req.body;

  if (username !== 'usuario') {
    console.log(`Usuário inválido: ${username}`);
    return res.status(401).json({ message: 'Usuário inválido' });
  }
  req.user = { username };
  next();
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Microsserviço de Alteração de Senha rodando na porta ${port}`);
});
