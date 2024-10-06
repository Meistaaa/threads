import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Ensure that the token contains a valid _id
    if (!token?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 404 }
      );
    }

    // Find fromUser and assert the type
    const fromUser = await UserModel.findById(token._id);
    if (!fromUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 404 }
      );
    }

    const reqBody = await req.json();
    const { id } = reqBody;

    // Find toUser and assert the type
    const toUser = await UserModel.findById(id);
    if (!toUser) {
      return NextResponse.json(
        { success: false, message: "Cannot Find the User" },
        { status: 500 }
      );
    }
    if (fromUser.friends.includes(id)) {
      return NextResponse.json(
        { success: false, message: "You Are Already Friends With them" },
        { status: 402 }
      );
    }

    if (toUser?.friendRequest.includes(fromUser.id)) {
      return NextResponse.json(
        { success: false, message: "Friend Request Already Sent" },
        { status: 402 }
      );
    }
    // Manipulate friend requests
    fromUser.sentFriendRequest.push(id); // `id` should be of type `string`
    await fromUser.save(); // Save changes to fromUser

    toUser.friendRequest.push(fromUser.id); // `fromUser._id` is an ObjectId
    await toUser.save(); // Save changes to toUser

    return NextResponse.json(
      { success: true, message: "Friend Request Sent Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
