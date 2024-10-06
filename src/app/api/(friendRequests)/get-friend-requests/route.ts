import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const user = await UserModel.findById(token?._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user.friendRequest },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
