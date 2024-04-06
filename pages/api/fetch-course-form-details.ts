import { NextApiRequest, NextApiResponse } from 'next';
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { course_id } = req.query;
      if (!course_id) {
        return res.status(400).json({ error: 'course_id is required' });
      }

      const client = await pool.connect();
      const query = `
        SELECT course_title, course_ic, course_type, course_faculties
        FROM course_details
        WHERE course_id = $1;
      `;
      const values = [course_id as string];
      const result: QueryResult<any> = await client.query(query, values);
      client.release();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const { course_title, course_ic, course_type, course_faculties } = result.rows[0];
      res.status(200).json({ course_title, course_ic, course_type, course_faculties });
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}