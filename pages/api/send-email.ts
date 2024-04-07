import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmailToRecipient } from '../../utils/massmail';
import { GroupedStudents } from '../admin';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const groupedStudents: GroupedStudents[] = req.body;

      const client = await pool.connect();

      for (const group of groupedStudents) {
        const { students, ic_mail } = group;
        const recipientEmail = ic_mail;

        try {
          await sendEmailToRecipient(students, recipientEmail);
          
          const updateQuery = `
            UPDATE form_details
            SET email_status = true
            WHERE id = ANY($1)
          `;
          const studentIds = students.map((student) => student.student_id);
          await client.query(updateQuery, [studentIds]);
        } catch (error) {
          console.error(`Error sending email to ${recipientEmail}:`, error);
        }
      }

      client.release();

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}