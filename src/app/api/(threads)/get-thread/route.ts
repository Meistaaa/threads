import dbConnect from "@/app/lib/dbConnect";
import { authenticateUser } from "@/app/lib/getAuthenticatedUser";
import Thread from "@/app/models/Thread";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    // Get the id from the URL parameters
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Failed to get a post" },
        { status: 400 }
      );
    }

    console.log("Fetching thread with id:", id);
    const getPostById = await Thread.findById(id);

    if (!getPostById) {
      return NextResponse.json(
        { success: false, message: "Post Does Not Exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: getPostById },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get a post", error);
    return NextResponse.json(
      { success: false, message: "Failed to get a post" },
      { status: 500 }
    );
  }
}
