import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const identifierRaw = credentials.identifier?.trim();
          const identifierLower = identifierRaw?.toLowerCase();
          const password = credentials.password;

          // ⭐ 1️⃣ Try finding user by email (emails can be case-sensitive)
          let user = await UserModel.findOne({
            email: identifierRaw,
          });

          // ⭐ 2️⃣ If no user via email, try lowercase username
          if (!user) {
            user = await UserModel.findOne({
              username: identifierLower,
            });
          }

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    // ⭐ 3️⃣ Add custom fields (including displayName) to the session
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;

        session.user.username = token.username; // lowercase username
        session.user.displayName = token.displayName; // ⭐ original case
      }
      return session;
    },

    // ⭐ 4️⃣ Add custom fields to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;

        token.username = user.username; // lowercase
        token.displayName = user.displayName; // original name
      }
      return token;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
