import pg from 'pg';
const { Pool } = pg;

export const query = async (query, params = []) => {
  const pool = new Pool({
    max: 10,
    idleTimeoutMillis: 10000,
    // ssl: true,
  });

  let client;

  try {
    client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(query, params);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  } catch (error) {
    console.error('Error al conectar al pool de PostgreSQL:', error);
    throw error;
  }
};