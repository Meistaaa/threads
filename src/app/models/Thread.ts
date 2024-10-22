import mongoose, { Schema } from "mongoose";
import { User } from "./User";
import { Community } from "./Community";

export interface Thread extends Document {
  text: string;
  author: User;
  community: Community;
  imageUrls: string[];
  createdAt: Date;
  parentId: string;
}
const threadSchema: Schema<Thread> = new mongoose.Schema({
  text: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrls: [
    {
      type: String,
    },
  ],
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
