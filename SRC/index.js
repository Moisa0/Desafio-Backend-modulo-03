const express = require('express');
const app = express();
const rotasDeUsuario = require('./rotas/rotaDeUsuario');
const rotasDeTransicao = require('./rotas/rotaDeTransacao');

app.use('/usuarios', rotasDeUsuario);
app.use('/transicoes', rotasDeTransicao);


app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000`);
});
