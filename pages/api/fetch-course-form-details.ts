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

      const courseQuery = `
        SELECT course_title, course_ic, course_type, course_faculties
        FROM course_details
        WHERE course_id = $1;
      `;
      const courseValues = [course_id as string];
      const courseResult: QueryResult<any> = await client.query(courseQuery, courseValues);

      if (courseResult.rows.length === 0) {
        client.release();
        return res.status(404).json({ error: 'Course not found' });
      }

      const { course_title, course_ic, course_type, course_faculties } = courseResult.rows[0];

      const courseFacultiesArray = JSON.parse(course_faculties);

      const facultyQuery = `
        SELECT faculty_name
        FROM faculty_details
        WHERE email_id = ANY($1);
      `;
      const facultyValues = [courseFacultiesArray];
      const facultyResult: QueryResult<any> = await client.query(facultyQuery, facultyValues);

      client.release();

      // Map the faculty names to the course faculties
      const facultyNames = facultyResult.rows.map((row) => row.faculty_name);

      res.status(200).json({
        course_title,
        course_ic,
        course_type,
        course_faculties: courseFacultiesArray,
        faculty_names: facultyNames,
      });
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}