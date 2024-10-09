import dbConnect from "@/app/lib/dbConnect";
import UserModel, { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

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

    // Find fromUser and assert the type
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }
    const reqBody = await req.json();
    const { id } = reqBody;

    // Ensure id is an array
    const idsToRemove = Array.isArray(id) ? id : [id];

    // Filter out the IDs that need to be removed
    foundUser.friendRequest = foundUser.friendRequest.filter(
      (friendId) => !idsToRemove.includes(friendId.toString())
    );

    await foundUser.save();
    return NextResponse.json(
      { success: true, message: "Friend request removed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
