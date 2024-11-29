import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");
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

    let query = {};
    if (cursor) {
      query = { createdAt: { $lt: cursor }, author: user };
    }
    const threads = await Thread.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    return NextResponse.json(
      {
        success: true,
        data: threads,
        nextCursor:
          threads.length > 0 ? threads[threads.length - 1].createdAt : null,
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
