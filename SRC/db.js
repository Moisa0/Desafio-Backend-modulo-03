const { Pool } = require('pg');
const { conexaoString } = require('./config');
const pool = new Pool({
  connectionString: conexaoString,
});
const query = async (texto, parametros) => {
  const client = await pool.connect();
  try {
    const resultado = await client.query(texto, parametros);
    return resultado; 
  } finally {
    client.release();
  }
};

module.exports = {
  query,
};
