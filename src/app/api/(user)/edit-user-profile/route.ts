import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
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

    const foundUser = await UserModel.findById(user).select("-password");
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }
    const { username, bio, avatar } = await req.json();
    console.log(username, bio, avatar);
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username Field Cannot be Empty" },
        { status: 400 }
      );
    }

    // Optional validation for bio and avatar if necessary
    foundUser.username = username;
    foundUser.bio = bio || foundUser.bio;
    foundUser.avatar = avatar || foundUser.avatar;

    await foundUser.save();

    return NextResponse.json(
      { success: true, message: "User Profile Successfully Updated" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to edit user at the moment.",
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
