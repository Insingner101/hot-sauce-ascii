import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmailToRecipient } from '../../utils/massmail';
import { GroupedStudents } from '../admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const groupedStudents: GroupedStudents[] = req.body;

      for (const group of groupedStudents) {
        const { students, ic_mail } = group;
        const recipientEmail = ic_mail;

        sendEmailToRecipient(students, recipientEmail);
      }

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}