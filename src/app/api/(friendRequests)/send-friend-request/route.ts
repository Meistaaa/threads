import dbConnect from "@/app/lib/dbConnect";
import UserModel, { User } from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

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
    const fromUser = await UserModel.findById(user._id);
    console.log(fromUser?.username);
    if (!fromUser) {
      return NextResponse.json(
        { success: false, message: "User Does Not Exist" },
        { status: 404 }
      );
    }

    const reqBody = await req.json();
    const { id } = reqBody;

    // Find toUser and assert the type
    const toUser = await UserModel.findById(id);
    if (!toUser) {
      return NextResponse.json(
        { success: false, message: "Cannot Find the User" },
        { status: 500 }
      );
    }
    if (fromUser.friends.includes(id)) {
      return NextResponse.json(
        { success: false, message: "You Are Already Friends With them" },
        { status: 402 }
      );
    }

    if (toUser?.friendRequest.includes(fromUser.id)) {
      return NextResponse.json(
        { success: false, message: "Friend Request Already Sent" },
        { status: 402 }
      );
    }
    // Manipulate friend requests
    fromUser.sentFriendRequest.push(id); // `id` should be of type `string`
    await fromUser.save(); // Save changes to fromUser

    toUser.friendRequest.push(fromUser.id); // `fromUser._id` is an ObjectId
    await toUser.save(); // Save changes to toUser

    return NextResponse.json(
      { success: true, message: "Friend Request Sent Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
}
