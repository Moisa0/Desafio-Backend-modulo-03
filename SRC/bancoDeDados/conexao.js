const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  database: 'dindin',
  host: 'localhost',
  password: '2102',
  port: 5432, 
});


module.exports = pool;
