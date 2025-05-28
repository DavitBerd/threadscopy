import { StaticImageData } from "next/image";

export type UserType = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
};

export type PostType = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  likes: string[];
  repostsCount: number;
  sharesCount: number;
  imageUrl?: string | StaticImageData;
  comments?: CommentType[];
};

export type CommentType = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  postId: string;
  likes: string[];
  repostsCount: number;
  sharesCount: number;
  replies: ReplyType[];
  parentId: number;
};

export type ReplyType = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  commentId: string;
  likes: string[];
  repostsCount: number;
  sharesCount: number;
};
