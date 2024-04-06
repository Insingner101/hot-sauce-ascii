import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM form_details';
      const result = await client.query(query);
      const formDetails = result.rows;
      client.release();

      res.status(200).json(formDetails);
    } catch (error) {
      console.error('Error fetching form details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}