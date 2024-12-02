import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    onBoarded?: boolean;
    username?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      onBoarded?: boolean;
      username?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    onBoarded?: boolean;
    username?: string;
    accessToken?: string;
  }
}
