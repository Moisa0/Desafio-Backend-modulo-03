const express = require('express');
const app = express();
const rotasDeUsuario = require('./rotasDeUsuario');
const rotasDeTransicao = require('./rotasDeTransicao');

app.use('/usuarios', rotasDeUsuario);
app.use('/transicoes', rotasDeTransicao);

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
