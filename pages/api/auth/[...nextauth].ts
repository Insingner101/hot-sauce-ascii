import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account &&
        profile &&
        account.provider === "google" &&
        profile.email!.endsWith("@goa.bits-pilani.ac.in")
      ) {
        // console.log(account.session_state);
        // console.log(profile);
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        try {
          const client = await pool.connect();
          const result = await client.query(
            'SELECT role FROM public.user_details WHERE email_id = $1',
            [session.user.email]
          );
          client.release();

          if (result.rows.length > 0) {
            // @ts-ignore
            session.user.role = result.rows[0].role;
            console.log("User role:", result.rows[0].role);
          } else {
            // @ts-ignore
            session.user.role = "default";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // @ts-ignore
          session.user.role = "default";
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
