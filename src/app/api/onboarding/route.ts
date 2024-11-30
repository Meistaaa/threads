import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }

    const foundUser = await UserModel.findById(user._id).select("-password");
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }

    const { username, bio, avatar } = await req.json();
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username Field Cannot be Empty" },
        { status: 400 }
      );
    }

    foundUser.username = username;
    foundUser.bio = bio || foundUser.bio;
    foundUser.avatar = avatar || foundUser.avatar;
    foundUser.onBoarded = true;
    await foundUser.save();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      token.onBoarded = true;
    }

    return NextResponse.json(
      { success: true, message: "User Profile Successfully Updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred." },
      { status: 500 }
    );
  }
}
