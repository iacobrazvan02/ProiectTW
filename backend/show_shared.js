const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'food_waste_db',
  password: '1234',
  port: 5432,
});

(async () => {
  try {
    const res = await pool.query(
      `SELECT ag.id as share_id, ag.aliment_id, a.nume as aliment_nume, ag.grup_id, g.nume as grup_nume, ag.shared_at
       FROM alimente_grup ag
       LEFT JOIN alimente a ON ag.aliment_id = a.id
       LEFT JOIN grupuri g ON ag.grup_id = g.id
       ORDER BY ag.shared_at DESC`);
    if (res.rows.length === 0) {
      console.log('Nicio partajare gasita.');
    } else {
      console.table(res.rows);
    }
  } catch (err) {
    console.error('Eroare:', err.message);
  } finally {
    await pool.end();
  }
})();
