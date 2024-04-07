import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { student_id, email_id, course_id, component, grade, recommendation, remark} = req.body;

      const client = await pool.connect();
      await client.query('BEGIN');

      const getIdQuery = `
        SELECT id
        FROM form_details
        WHERE student_id = $1
        LIMIT 1;
      `;
      const getIdResult = await client.query(getIdQuery, [student_id]);

      if (getIdResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(404).json({ error: 'Student id not found - student hasnt applied for this course' });
      }

      const formDetailsId = getIdResult.rows[0].id;

      const updateQuery = `
        INSERT INTO fdcm_details (id, student_id, email_id, course_id, component, grade, recommendation, remark, signed_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
        ON CONFLICT (id) DO UPDATE SET
          student_id = $2,
          email_id = $3,
          course_id = $4,
          component = $5,
          grade = $6,
          recommendation = $7,
          remark = $8,
          signed_status = false;
      `;
      await client.query(updateQuery, [formDetailsId, student_id, email_id, course_id, component, grade, recommendation, remark]);

      await client.query('COMMIT');
      client.release();

      res.status(200).json({ message: 'FDCM details updated successfully' });
    } catch (error) {
      console.error('Error updating FDCM details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}