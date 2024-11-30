import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log(decodedUsername, code);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification Code has expired. Please Sign Up again!",
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Code!",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log("error verifying user");
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
