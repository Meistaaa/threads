import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    // check if username already exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    // verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // code expiry date
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    // check if email already exists
    const existingUserByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserByEmail) {
      // if it exists check if it is verified if it is then success false
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email Already Exists",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        message: [],
      });
      await newUser.save();
    }

    //send verification email
    console.log("user email send");

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log(emailResponse);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    console.log("user email sent");
    return NextResponse.json(
      {
        success: true,
        message: "User Registered Successfully . Please Verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error registering user", error);
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
