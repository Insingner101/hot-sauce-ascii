import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();

      const formQuery = 'SELECT * FROM fdcm_details';
      const formResult = await client.query(formQuery);
      const formDetails = formResult.rows;

      const courseQuery = 'SELECT course_id, course_ic FROM course_details';
      const courseResult = await client.query(courseQuery);
      const courseDetails: { [key: string]: string } = {};
      courseResult.rows.forEach((row) => {
        courseDetails[row.course_id] = row.course_ic;
      });

      const facultyQuery = 'SELECT email_id, faculty_name FROM faculty_details';
      const facultyResult = await client.query(facultyQuery);
      const facultyDetails: { [key: string]: string } = {};
      facultyResult.rows.forEach((row) => {
        facultyDetails[row.email_id] = row.faculty_name;
      });

      client.release();

      const formDetailsWithDetails = formDetails.map((form) => {
        const courseIc = courseDetails[form.course_id] || '';
        const facultyName = facultyDetails[courseIc] || '';
        return {
          ...form,
          course_ic: courseIc,
          faculty_name: facultyName,
        };
      });

      res.status(200).json(formDetailsWithDetails);
    } catch (error) {
      console.error('Error fetching form details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}