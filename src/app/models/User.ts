import mongoose, { Document, Schema } from "mongoose";
import { Community } from "./Community";
import { ThreadModel } from "./Thread";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  onBoarded: boolean;
  communities: Community[];
  threads: ThreadModel[];
  friendRequest: User[];
  friends: User[];
  sentFriendRequest: User[];
  verifyCode: string;
  verifyCodeExpiry: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please use a valid email address"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  avatar: String,
  bio: String,
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },

  onBoarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  friendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
