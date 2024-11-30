import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        console.log("hello");
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              {
                username: credentials.identifier,
              },
              {
                email: credentials.identifier,
              },
            ],
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

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
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
      }

      // On every request (after initial sign-in)
      if (!token.onBoarded) {
        // Fetch latest `onBoarded` value from the database
        const foundUser = await UserModel.findById(token._id).select(
          "onBoarded"
        );
        if (foundUser) {
          token.onBoarded = foundUser.onBoarded;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      session.user._id = token._id;
      session.user.isVerified = token.isVerified;
      session.user.onBoarded = token.onBoarded;
      session.user.username = token.username;
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
