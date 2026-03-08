const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log("DATABASE_URL:", connectionString);

const pool = new Pool({
  connectionString: connectionString,
});

module.exports = pool;