import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;      // lowercase version
    displayName?: string;   // ⭐ original cased version (Avinash)
  }

  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;      // lowercase
      displayName?: string;   // ⭐ pretty name to show in UI
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;       // lowercase
    displayName?: string;    // ⭐ original casing
  }
}
