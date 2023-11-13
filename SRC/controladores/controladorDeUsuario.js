const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


const pool = require('../bancoDeDados/conexao')


const autenticarUsuario = (req, res, next) => {
const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado' });
  }

  try {
const decoded = jwt.verify(token, 'seu_segredo_jwt');

    
    req.usuario = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado' });
  }
};

app.get('/usuarios/perfil', autenticarUsuario, (req, res) => {
  
const userId = req.usuario.id;
  pool.query('SELECT * FROM usuarios WHERE id = $1', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao consultar o perfil do usuário' });
    }
const perfil = result.rows[0];
    return res.status(200).json({ perfil });
  });
});


app.put('/usuarios/perfil', autenticarUsuario, (req, res) => {
const userId = req.usuario.id;
const { nome, email } = req.body;

 
  pool.query('UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3', [nome, email, userId], (err) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao atualizar o perfil do usuário' });
    }
    return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso' });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
