import { NextApiRequest, NextApiResponse } from "next";
import makeCertificate from "../../utils/run";
import { GroupedStudents } from "../admin";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { mail } = req.body;
      const client = await pool.connect();

      console.log(mail);
      try {
        const fdcmQuery = `SELECT * FROM fdcm_details`;
        const result = await client.query(fdcmQuery);
        // const studentDetails: { [key: string]: string } = {};
        // result.rows.forEach((row) => {
        //   studentDetails[row.course_id] = row.course_ic;
        // });
        console.log(result.rows);
        await makeCertificate("Shaji", "Gay balls");
      } catch (error) {
        console.error(`Error downloading certificate:`, error);
      }

      client.release();
      res.status(200).json({ message: "Certificate downloaded successfully" });
    } catch (error) {
      console.error("Error sending emails:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
