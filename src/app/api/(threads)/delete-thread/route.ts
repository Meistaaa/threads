import dbConnect from "@/app/lib/dbConnect";
import Thread from "@/app/models/Thread";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    const user = await UserModel.findById(token?._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "UnAuthorized" },
        { status: 401 }
      );
    }

    const deleteResult = await Thread.deleteOne({ _id: id, author: user.id });

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
