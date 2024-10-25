import dbConnect from "@/app/lib/dbConnect";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    // Find fromUser and assert the type
    const fromUser = await UserModel.findById(user);
    console.log(fromUser?.username);
    if (!fromUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
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
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.message || "Unable to send friend request at the moment.",
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
