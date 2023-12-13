const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const secretKey = 'seuSegredoSuperSecreto';

app.use(bodyParser.json());

app.post('/register-user', (req, res) => {
  const { username, token } = req.body;

  // Verifica a autenticidade do token recebido do microsserviço de registro
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    // Lógica para armazenar o usuário ou realizar ações adicionais
    console.log(`Usuário registrado no microsserviço de alteração de senha: ${user.username}`);
    
    res.json({ message: 'Usuário registrado com sucesso no microsserviço de alteração de senha' });
  });
});

app.put('/change-password', authenticateToken, (req, res) => {
  const { username, newPassword } = req.body;
  
  // Lógica para alterar a senha do usuário no banco de dados (simulado por um log)
  console.log(`Senha alterada para o usuário ${username}: ${newPassword}`);
  
  res.json({ message: 'Senha alterada com sucesso' });
});

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
