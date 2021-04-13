const { Pool } = require('pg');

// for local dev
// const db = new Pool({
//   user: 'jacobwpeterson',
//   host: 'localhost',
//   database: 'reviews',
//   password: 'postgres',
//   port: 5432,
//   max: 50,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 4000,
// });

const db = new Pool({
  host: 'ec2-54-67-93-161.us-west-1.compute.amazonaws.com',
  user: 'ubuntu',
  password: 'ubuntu',
  database: 'reviews',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = db;
