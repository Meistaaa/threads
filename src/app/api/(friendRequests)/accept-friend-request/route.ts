import dbConnect from "@/app/lib/dbConnect";
import UserModel, { User } from "@/app/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
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

    const toUser = await UserModel.findById(id);

    // check if the other user exists
    if (!toUser) {
      return NextResponse.json(
        { success: false, message: "User Doesnt exist" },
        { status: 402 }
      );
    }

    // check if they are already friend with the other user
    if (foundUser.friends.includes(id)) {
      return NextResponse.json(
        { success: false, message: "You Are Already Friends With them" },
        { status: 402 }
      );
    }

    foundUser.friends.push(id);
    await foundUser.save();

    toUser.friends.push(foundUser.id);
    toUser.save();

    return NextResponse.json(
      { success: true, message: "Friend Request Accepted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Accepting Request" },
      { status: 500 }
    );
  }
}
