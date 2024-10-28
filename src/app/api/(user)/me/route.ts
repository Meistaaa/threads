import dbConnect from "@/app/lib/dbConnect";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const user = await authenticateUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }
    console.log("test1");
    const me = await UserModel.findById(user).select("-password");
    console.log("test2");
    if (!me) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }
    console.log(me);

    return NextResponse.json(
      {
        success: true,
        data: { username: me.username, bio: me.bio, pfp: me.imageUrl },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to get user at the moment.",
        },
        { status: 500 }
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
