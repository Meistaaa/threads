import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    const deleteResult = await Thread.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete a post" },
      { status: 500 }
    );
  }
}
