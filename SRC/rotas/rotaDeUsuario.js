const express = require('express');
const router = express.Router();
const controladoresDeUsuario = require('./controladoresDeUsuario');

router.post('/usuarios/cadastrar', controladoresDeUsuario.cadastrarUsuario);

router.post('/usuarios/login', controladoresDeUsuario.fazerLogin);

router.get('/usuarios/perfil', controladoresDeUsuario.detalharPerfil);

router.put('/usuarios/perfil', controladoresDeUsuario.editarPerfil);

module.exports = router;