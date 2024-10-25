import dbConnect from "@/app/lib/dbConnect";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import Thread from "@/app/models/Thread";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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
    const { id, text } = reqBody;

    const updateThread = await Thread.findByIdAndUpdate(
      id,
      { text },
      { new: true, runValidators: true } // Return the updated document & validate the schema
    );

    if (updateThread.author !== user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized!" },
        { status: 404 }
      );
    }
    if (!updateThread) {
      return NextResponse.json(
        { success: false, message: "Failed to update a Thread" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thread Updated Successfully",
        thread: updateThread,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to update thread at the moment.",
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
