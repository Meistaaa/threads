import dbConnect from "@/app/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../api/(authentication)/auth/[...nextauth]/options";
import UserModel from "../models/User";

export async function authenticateUser() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return null;
    }
    const getUser = await UserModel.findById(user._id);
    console.log(getUser?.id);
    console.log("hel");
    return getUser?.id;
  } catch (error) {
    console.log("Failed to upload a post", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload a post" },
      { status: 500 }
    );
  }
}
