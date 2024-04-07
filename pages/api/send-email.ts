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

          for (const student of students) {
            const { student_id } = student;
            const updateQuery = `UPDATE form_details SET email_status = true WHERE student_id = $1`;
            await client.query(updateQuery, [student_id]);
          }
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