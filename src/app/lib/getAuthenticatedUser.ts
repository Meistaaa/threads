import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../models/User";
import { getDataFromToken } from "./getDataFromToken";

export async function authenticateUser(req: NextRequest) {
  await dbConnect();
  try {
    const user = await getDataFromToken(req);
    const getUser = await UserModel.findById(user).select("-password");
    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "No user found " },
        { status: 500 }
      );
    }
    return getUser;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to check for authenticated User " },
      { status: 500 }
    );
  }
}
