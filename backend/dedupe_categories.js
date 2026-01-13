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
    console.log('-- Categories before --');
    const before = await pool.query("SELECT id, nume FROM categorii ORDER BY lower(trim(nume)), id");
    console.table(before.rows);

    const dupRes = await pool.query("SELECT lower(trim(nume)) AS key, min(id) AS keep_id, array_agg(id) AS ids FROM categorii GROUP BY lower(trim(nume)) HAVING count(*) > 1");
    if (dupRes.rows.length === 0) {
      console.log('No duplicate categories found.');
    } else {
      for (const r of dupRes.rows) {
        console.log('Processing', r.key, '-> keep', r.keep_id, 'ids', r.ids);
        await pool.query('BEGIN');
        try {
          await pool.query('UPDATE alimente SET categorie_id = $1 WHERE categorie_id = ANY($2::int[]) AND categorie_id <> $1', [r.keep_id, r.ids]);
          await pool.query('DELETE FROM categorii WHERE id = ANY($1::int[]) AND id <> $2', [r.ids, r.keep_id]);
          await pool.query('COMMIT');
          console.log('Merged group', r.key);
        } catch (e) {
          await pool.query('ROLLBACK');
          console.error('Failed for', r.key, e.message);
        }
      }
    }

    console.log('-- Categories after --');
    const after = await pool.query("SELECT id, nume FROM categorii ORDER BY lower(trim(nume)), id");
    console.table(after.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();
