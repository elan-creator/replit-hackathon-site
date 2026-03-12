import pool from '../lib/db';

async function fixOrphanData() {
  const tables = ['surveys', 'ideas', 'services', 'retrospectives'];

  const cohorts = await pool.query('SELECT id, event_date FROM cohorts ORDER BY event_date ASC');
  if (cohorts.rows.length === 0) {
    console.log('No cohorts exist. Cannot assign orphan records.');
    process.exit(1);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const futureCohorts = cohorts.rows.filter((c: { event_date: string }) => new Date(c.event_date) >= now);
  const pastCohorts = cohorts.rows.filter((c: { event_date: string }) => new Date(c.event_date) < now);

  let targetCohortId: number;
  if (futureCohorts.length > 0) {
    targetCohortId = futureCohorts[0].id;
  } else if (pastCohorts.length > 0) {
    targetCohortId = pastCohorts[pastCohorts.length - 1].id;
  } else {
    targetCohortId = cohorts.rows[0].id;
  }

  console.log(`Target cohort ID: ${targetCohortId}`);

  for (const table of tables) {
    const countResult = await pool.query(`SELECT COUNT(*) FROM ${table} WHERE cohort_id IS NULL`);
    const orphanCount = parseInt(countResult.rows[0].count, 10);

    if (orphanCount > 0) {
      const result = await pool.query(
        `UPDATE ${table} SET cohort_id = $1 WHERE cohort_id IS NULL`,
        [targetCohortId]
      );
      console.log(`Fixed ${result.rowCount} orphan records in ${table}`);
    } else {
      console.log(`No orphan records in ${table}`);
    }
  }

  await pool.end();
  console.log('Done.');
}

fixOrphanData().catch(err => {
  console.error('Failed to fix orphan data:', err);
  process.exit(1);
});
