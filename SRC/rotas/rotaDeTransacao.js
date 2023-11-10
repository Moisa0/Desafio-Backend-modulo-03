const express = require('express');
const router = express.Router();
const controladoresDeTransacao = require('./controladoresDeTransacao');

router.get('/categorias', controladoresDeTransacao.listarCategorias);

router.get('/transacoes', controladoresDeTransacao.listarTransacoes);

router.get('/transacoes/:transacaoId', controladoresDeTransacao.detalharTransacao);

router.post('/transacoes', controladoresDeTransacao.cadastrarTransacao);

router.put('/transacoes/:transacaoId', controladoresDeTransacao.editarTransacao);

router.delete('/transacoes/:transacaoId', controladoresDeTransacao.removerTransacao);

router.get('/extrato', controladoresDeTransacao.obterExtrato);

router.get('/transacoes/categoria/:categoriaId', controladoresDeTransacao.filtrarTransacoesPorCategoria);

module.exports = router;