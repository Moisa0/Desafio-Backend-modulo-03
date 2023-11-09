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
    throw new Error('Erro ao cadastrar usuário');
  }
};

router.post('/usuarios/cadastrar', async (req, res) => {
const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
  }

const usuarioExistente = await verificarEmailExistente(email);

  if (usuarioExistente) {
    return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
  }

const senhaHash = await bcrypt.hash(senha, 10);

const novoUsuario = await cadastrarUsuario(nome, email, senhaHash);

const token = jwt.sign({ id: novoUsuario.id }, segredoJwt);

  return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso', token });
});

router.post('/usuarios/login', async (req, res) => {
const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios para fazer login' });
  }

const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

const token = jwt.sign({ id: usuario.id }, segredoJwt);

  return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
});

router.get('/usuarios/perfil', autenticarUsuario, controladoresDeUsuario.detalharPerfil);

router.put('/usuarios/perfil', autenticarUsuario, controladoresDeUsuario.editarPerfil);

module.exports = router;
