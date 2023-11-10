const { Pool } = require('pg');
const { conexaoString } = require('./config');

const pool = new Pool({
  connectionString: conexaoString,
});

const consultar = async (texto, parametros) => {
  const cliente = await pool.connect();
  try {
    const resultado = await cliente.query(texto, parametros);
    return resultado;
  } finally {
    cliente.release();
  }
};

module.exports = {
  consultar,
};