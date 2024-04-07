import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { student_id, course_id } = req.body;

      if (!student_id || !course_id) {
        return res.status(400).json({ error: 'student_id and course_id are required' });
      }

      const client = await pool.connect();

      // Check if the signed_status is already true
      const checkQuery = `
        SELECT signed_status
        FROM fdcm_details
        WHERE student_id = $1 AND course_id = $2;
      `;
      const checkValues = [student_id, course_id];
      const checkResult = await client.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0 && checkResult.rows[0].signed_status) {
        client.release();
        return res.status(200).json({ message: 'Already signed' });
      }

      const updateQuery = `
        UPDATE fdcm_details
        SET signed_status = true
        WHERE student_id = $1 AND course_id = $2;
      `;
      const values = [student_id, course_id];

      const result = await client.query(updateQuery, values);
      client.release();

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'No matching record found' });
      }

      res.status(200).json({ message: 'Signed status updated successfully' });
    } catch (error) {
      console.error('Error updating signed status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}