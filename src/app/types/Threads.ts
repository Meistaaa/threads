import { User } from "../models/User";

export interface ThreadModel {
  _id: string;
  text: string;
  imageUrls: string[];
  author: User;
  createdAt: string;
}
