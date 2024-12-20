import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function GET(req: NextRequest) {
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
    const id = req.nextUrl.searchParams.get("id");

    const foundUser = await UserModel.findById(id).select("-password");
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, data: foundUser },
      { status: 500 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Unable to get user at the moment.",
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
