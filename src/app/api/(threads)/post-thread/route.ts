import dbConnect from "@/app/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import Thread from "@/app/models/Thread";

export async function POST(req: NextRequest) {
  await dbConnect();
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
    console.log("user._id : ", user._id);

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
    const newPost = new Thread({
      author: user._id,
      text: content,
      imageUrls,
    });

    await newPost.save();
    return NextResponse.json(
      {
        success: true,
        message: "Upload Complete",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to upload a post", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload a post" },
      { status: 500 }
    );
  }
}
