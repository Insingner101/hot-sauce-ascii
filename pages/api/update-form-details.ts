import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { student_id, name, course_id, grade, links, email_id, course_ic } = req.body;

      const client = await pool.connect();

      // Check if the student_id and course_id combination already exists in the form_details table
      const checkStudentCourseQuery = `SELECT 1 FROM form_details WHERE student_id = $1 AND course_id = $2`;
      const checkStudentCourseResult = await client.query(checkStudentCourseQuery, [student_id, course_id]);
      if (checkStudentCourseResult.rows.length > 0) {
        client.release();
        return res.status(400).json({ message: 'Student has already applied for this course' });
      }

      const checkCourseQuery = `SELECT 1 FROM course_details WHERE course_id = $1`;
      const checkCourseResult = await client.query(checkCourseQuery, [course_id]);
      if (checkCourseResult.rows.length === 0) {
        client.release();
        return res.status(400).json({ message: 'Invalid course id' });
      }

      const checkEmailExistsQuery = `SELECT role FROM user_details WHERE email_id = $1`;
      const checkEmailExistsResult = await client.query(checkEmailExistsQuery, [email_id]);
      let isUnauthorized = false;
      if (checkEmailExistsResult.rows.length > 0) {
        if (checkEmailExistsResult.rows[0].role !== 'STUDENT') {
          isUnauthorized = true;
        }
      }

      if (isUnauthorized) {
        client.release();
        return res.status(403).json({ message: 'Unauthorized submission' });
      }

      const newId = uuidv4();
      const query = `INSERT INTO form_details (id, student_id, name, course_id, grade, links, email_id, course_ic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
      const values = [newId, student_id, name, course_id, grade, links, email_id, course_ic];
      await client.query(query, values);

      client.release();
      res.status(200).json({ message: 'Form details updated successfully' });
    } catch (error) {
      console.error('Error updating form details:', error);
      res.status(500).json({ message: 'Error updating form details' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
