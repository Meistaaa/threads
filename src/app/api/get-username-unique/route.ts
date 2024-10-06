import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const reqBody = await req.json();
    const { username } = reqBody;
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username Cannot be empty" },
        { status: 400 }
      );
    }

    const getPostByUsername = await UserModel.find({ username });

    if (getPostByUsername) {
      return NextResponse.json(
        { success: false, message: "Username must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Username Is Unique " },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
