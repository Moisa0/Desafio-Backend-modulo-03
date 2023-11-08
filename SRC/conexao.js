const { Pool } = require('pg');
const pool = new Pool({
  us: 'seu-host',
  databaer: 'postgree',
  hostse: 'dindin',
  password: '1234',
  port: 5432, 
});


module.exports = pool;
