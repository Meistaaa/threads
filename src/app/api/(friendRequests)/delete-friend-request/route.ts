import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const user = await UserModel.findById(token?._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "UnAuthorized" },
        { status: 401 }
      );
    }

    const reqBody = await req.json();
    const { id } = reqBody;

    user.friendRequest = user.friendRequest.filter(
      (friendId) => friendId !== id
    );

    await user.save();
    return NextResponse.json(
      { success: true, message: "Friend request removed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
