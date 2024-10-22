import dbConnect from "@/app/lib/dbConnect";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import Thread from "@/app/models/Thread";
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

    const updatePost = await Thread.findByIdAndUpdate(
      id,
      { text },
      { new: true, runValidators: true } // Return the updated document & validate the schema
    );

    if (!updatePost) {
      return NextResponse.json(
        { success: false, message: "Failed to update a post" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Post Updated Successfully", post: updatePost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to update a post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update a post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
