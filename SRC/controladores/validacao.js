const express = require('express');
const router = express.Router();
const controladoresDeUsuario = require('./controladoresDeUsuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { segredoJwt } = require('./config');
const Usuario = require('./models/Usuario');

const autenticarUsuario = (req, res, next) => {
const token = req.headers.Authorization

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

const cadastrarUsuario = async (req, res) => {
const {nome, email, pass}= req.body


if (!nome || !email || !pass) {
  return res.status(400).json({ error: 'Por favor, verifique se os campos estão preenchidos corretamente' });
}

try {
  const emailDuplicado = await pool.query(`select * from usuarios where email = $1`, [email]);

  if (emailDuplicado.rowCount > 0) {
      return res.status(400).json({ error: 'Este email já está cadastrado. Tentei Outro' });
  }
  const hash = await bcrypt.hash(pass, 10);
  const query = `insert into usuarios (nome, email, pass) values ($1, $2, $3) returning *`;
  const { rows } = await pool.query(query, [nome, email, hash]);
  const { pass: _, ...usuario } = rows[0];

  return res.status(201).json(usuario);
} catch (error) {
  return res.status(400).json({ error: 'Ocorreu um erro no cadastro do usuário' });}
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
