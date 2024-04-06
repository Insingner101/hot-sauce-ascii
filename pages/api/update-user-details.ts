import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

enum RolePriority {
  ADMIN = 1,
  HOD = 2,
  FACULTY = 3,
  IC = 3,
  STUDENT = 4,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { currentUserEmail, newUserEmail, newUserRole } = req.body;
      const client = await pool.connect();
      await client.query('BEGIN');

      const currentUserRoleQuery = `
        SELECT role FROM user_details WHERE email_id = $1
      `;
      const currentUserRoleResult = await client.query(currentUserRoleQuery, [currentUserEmail]);

      if (currentUserRoleResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(403).json({ message: 'Access denied - undefined role' });
      }

      const currentUserRole = currentUserRoleResult.rows[0].role;
      const currentUserPriority = RolePriority[currentUserRole];
      const newUserPriority = RolePriority[newUserRole] || RolePriority.STUDENT;

      if (currentUserPriority <= newUserPriority) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(403).json({ message: 'Insufficient permissions to add new user' });
      }

      let newUserId = null;
      if (newUserRole === 'FACULTY' || newUserRole === 'HOD' || newUserRole === 'IC') {
        newUserId = uuidv4();
      }

      const updateUserDetailsQuery = `
        INSERT INTO user_details (email_id, role, id)
        VALUES ($1, $2, $3)
        ON CONFLICT (email_id) DO UPDATE SET role = $2, id = $3;
      `;
      await client.query(updateUserDetailsQuery, [newUserEmail, newUserRole, newUserId]);

      if (newUserRole === 'STUDENT') {
        const updateIdQuery = `
          UPDATE user_details ud
          SET id = (
            SELECT fd.id
            FROM form_details fd
            WHERE fd.email_id = ud.email_id
            LIMIT 1
          )
          WHERE ud.email_id = $1;
        `;
        await client.query(updateIdQuery, [newUserEmail]);
        
      } else if (newUserRole === 'FACULTY' || newUserRole === 'HOD' || newUserRole === 'IC') {
        const updateFacultyDetailsQuery = `
          INSERT INTO faculty_details (id, email_id, role, faculty_name)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (email_id) DO UPDATE SET role = $3, id = $1, faculty_name = $4;
        `;
        await client.query(updateFacultyDetailsQuery, [newUserId, newUserEmail, newUserRole]);
      }

      await client.query('COMMIT');
      client.release();

      res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ message: 'Error updating user details' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}