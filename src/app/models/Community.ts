import mongoose, { Schema } from "mongoose";
import { Thread } from "./Thread";
import { User } from "./User";

export interface Community extends Document {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  createdBy: User;
  threads: Thread[];
  members: User[];
}
const communitySchema: Schema<Community> = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
