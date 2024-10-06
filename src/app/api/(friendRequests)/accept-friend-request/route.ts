import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const user = await UserModel.findById(token?._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 404 }
      );
    }
    const reqBody = await req.json();
    const { id } = reqBody;

    const toUser = await UserModel.findById(id);

    // check if the other user exists
    if (!toUser) {
      return NextResponse.json(
        { success: false, message: "User Doesnt exist" },
        { status: 402 }
      );
    }

    // check if they are already friend with the other user
    if (user.friends.includes(id)) {
      return NextResponse.json(
        { success: false, message: "You Are Already Friends With them" },
        { status: 402 }
      );
    }

    user.friends.push(id);
    await user.save();

    toUser.friends.push(user.id);
    toUser.save();

    return NextResponse.json(
      { success: true, message: "Friend Request Accepted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Accepting Request" },
      { status: 500 }
    );
  }
}
