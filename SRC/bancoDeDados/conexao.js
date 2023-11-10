const { Pool } = require('pg');
const pool = new Pool({
  us: 'seu-host',
  databaer: '',
  hostse: '',
  password: '',
  port: 5432, 
});


module.exports = pool;
