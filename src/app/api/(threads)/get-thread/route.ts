import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    const getPostById = await Thread.findById(id);

    if (!getPostById) {
      return NextResponse.json(
        { success: false, message: "Post Does Not Exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: getPostById },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get a post", error);
    return NextResponse.json(
      { success: false, message: "Failed to get a post" },
      { status: 500 }
    );
  }
}
