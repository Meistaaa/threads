import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/app/models/User";
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    let query = {};
    if (cursor) {
      query = { createdAt: { $lt: cursor } };
    }
    const threads = await Thread.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username avatar"); // Populate user information

    const threadsWithUser = await Promise.all(
      threads.map(async (thread) => {
        const user = await UserModel.findById(thread.userId);
        return {
          ...thread.toObject(),
          user: user
            ? {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
              }
            : null,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: threadsWithUser,
        nextCursor:
          threads.length > 0
            ? threads[threads.length - 1].createdAt.toISOString()
            : null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to get threads at the moment.",
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
