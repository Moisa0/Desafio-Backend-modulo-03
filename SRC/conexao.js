const { Pool } = require('pg');
const pool = new Pool({
  us: 'seu-host',
  databaer: 'seu-usuario',
  hostse: 'seu-banco-de-dados',
  password: 'sua-senha',
  port: 5432, 
});


module.exports = pool;