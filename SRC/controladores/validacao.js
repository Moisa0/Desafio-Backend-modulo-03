const express = require('express');
const router = express.Router();
const controladoresDeUsuario = require('./controladoresDeUsuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { segredoJwt } = require('./config');
const Usuario = require('./models/Usuario');

const autenticarUsuario = (req, res, next) => {
const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado' });
  }

  try {
const decoded = jwt.verify(token, segredoJwt);

    req.usuario = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado' });
  }
};

const verificarEmailExistente = async (email) => {
  try {
const usuario = await Usuario.findOne({ where: { email } });
    return usuario;
  } catch (error) {
    throw new Error('Erro ao verificar e-mail existente');
  }
};

const cadastrarUsuario = async (nome, email, senhaHash) => {
  try {
const novoUsuario = await Usuario.create({ nome, email, senha: senhaHash });
    return novoUsuario;
  } catch (error) {
    throw an Error('Erro ao cadastrar usuário');
  }
};

router.post('/usuarios/cadastrar', async (req, res) => {
  
const token = jwt.sign({ id: novoUsuario.id }, segredoJwt);

  return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso', token });
});

router.post('/usuarios/login', async (req, res) => {

const token = jwt.sign({ id: usuario.id }, segredoJwt);

  return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
});

router.get('/perfil', autenticarUsuario, controladoresDeUsuario.detalharPerfil);
router.put('/perfil', autenticarUsuario, controladoresDeUsuario.editarPerfil);

module.exports = router;
