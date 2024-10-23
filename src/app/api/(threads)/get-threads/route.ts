import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  // Use req.nextUrl to get query parameters
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    let query = {};

    if (cursor) {
      query = { createdAt: { $lt: cursor } };
    }

    const posts = await Thread.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: posts,
        nextCursor: posts.length > 0 ? posts[posts.length - 1].createdAt : null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to get posts at the moment." },
      { status: 500 }
    );
  }
}
