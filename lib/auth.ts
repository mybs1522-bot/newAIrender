import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyOTP } from "@/lib/otp";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code || !credentials?.token) return null;
        const valid = verifyOTP(credentials.email, credentials.code, credentials.token);
        if (!valid) return null;
        return {
          id: credentials.email.toLowerCase().trim(),
          email: credentials.email.toLowerCase().trim(),
          name: credentials.email.split("@")[0],
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
