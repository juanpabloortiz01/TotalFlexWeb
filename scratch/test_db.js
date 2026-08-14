const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_0r6avCYEZhFg@ep-green-bread-aygwr54r-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  try {
    const res = await pool.query('SELECT * FROM membresias');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
