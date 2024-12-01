import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Thread from "@/app/models/Thread";
import mongoose from "mongoose";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import UserModel from "@/app/models/User";

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
    const reqBody = await req.json();
    const {
      content,
      imageUrls,
    }: { content: string; imageUrls: Array<string> } = reqBody;
    if (content.length === 0 && imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "The Thread cannot be empty" },
        { status: 400 }
      );
    }
    const foundUser = await UserModel.findById(user);
    if (!foundUser) {
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
    const newThread = new Thread({
      author: user,
      text: content,
      imageUrls,
    });
    await newThread.save();
    foundUser.threads.push(newThread);
    await foundUser.save();
    return NextResponse.json(
      {
        success: true,
        message: "Upload Complete",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to post thread at the moment.",
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
