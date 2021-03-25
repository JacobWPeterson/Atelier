const { Client } = require('pg');

//For local dev
// const db = new Client({
//   user: 'jacobwpeterson',
//   host: 'localhost',
//   database: 'reviews',
//   password: 'postgres',
//   port: 5432,
// });

const db = new Client({
  user: 'ubuntu',
  host: 'ec2-54-67-93-161.us-west-1.compute.amazonaws.com',
  database: 'reviews',
  password: 'ubuntu',
  port: 5432,
});

// db.connect();

module.exports = db;
