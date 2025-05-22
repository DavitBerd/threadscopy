export interface UserType {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface PostType {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  likes: string[];
  repostsCount: number;
  sharesCount: number;
  imageUrl?: string;
}

export interface CommentType {
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
}

export interface ReplyType {
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
}