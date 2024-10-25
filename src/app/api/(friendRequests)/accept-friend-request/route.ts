import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";
export async function GET(req: NextRequest) {
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
    const foundUser = await UserModel.findById(user);
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
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
    if (foundUser.friends.includes(id)) {
      return NextResponse.json(
        { success: false, message: "You Are Already Friends With them" },
        { status: 402 }
      );
    }
    console.log("object");

    foundUser.friends.push(id);
    await foundUser.save();

    toUser.friends.push(foundUser.id);
    toUser.save();

    return NextResponse.json(
      { success: true, message: "Friend Request Accepted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to accept request at the moment.",
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
