import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "UnAuthorized" },
        { status: 401 }
      );
    }
    const user = await UserModel.findById(token._id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }

    const reqBody = await req.json();
    const { id } = reqBody;

    const getUser = await UserModel.findById(id).select("-password");

    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, data: getUser },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
