import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
      //handle user authority
      //@ts-ignore
      session.user.role = "admin";
      return session;
    },
  },
};

export default NextAuth(authOptions);
