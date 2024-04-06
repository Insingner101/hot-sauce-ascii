import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();

      const formQuery = 'SELECT * FROM form_details';
      const formResult = await client.query(formQuery);
      const formDetails = formResult.rows;

      const facultyQuery = 'SELECT email_id, faculty_name FROM faculty_details';
      const facultyResult = await client.query(facultyQuery);

      client.release();

      const emailToNameMap: { [key: string]: string } = {};
      facultyResult.rows.forEach((row) => {
        emailToNameMap[row.email_id] = row.faculty_name;
      });

      const formDetailsWithIc = formDetails.map((form) => {
        const icName = emailToNameMap[form.course_ic] || '';
        return {
          ...form,
          ic: icName,
        };
      });

      res.status(200).json(formDetailsWithIc);
    } catch (error) {
      console.error('Error fetching form details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}