import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            email: credentials.identifier,
          });

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account ");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }
          const accessToken = jwt.sign(
            {
              _id: user._id,
              username: user.username,
              isVerified: user.isVerified,
              onBoarded: user.onBoarded,
            },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn: "1h" } // Token expires in 1 hour
          );

          console.log(user?.username);
          return {
            _id: user._id,
            username: user.username,
            isVerified: user.isVerified,
            onBoarded: user.onBoarded,
            accessToken,
          };
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.onBoarded = user.onBoarded; // Set initial value
        token.username = user.username;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      session.user._id = token._id;
      session.user.isVerified = token.isVerified;
      session.user.onBoarded = token.onBoarded;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      return session;
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
