const { Pool } = require('pg');

// const pool = new Pool();

const db = new Pool({
  user: 'jacobwpeterson',
  host: 'localhost',
  database: 'reviews',
  password: 'postgres',
  port: 5432,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
// db.connect();

module.exports = db;
