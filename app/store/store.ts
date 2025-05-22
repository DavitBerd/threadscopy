import { create } from "zustand";

type PostType = {
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
};

type CommentType = {
  parentId: number;
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
};

type ReplyType = {
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

type AppState = {
  posts: PostType[];
  comments: CommentType[];
  addPost: (post: PostType) => void;
  updatePost: (postId: string, updatedFields: Partial<PostType>) => void;
  addComment: (comment: CommentType) => void;
  updateComment: (
    commentId: string,
    updatedFields: Partial<CommentType>
  ) => void;
  addReply: (reply: ReplyType) => void;
  updateReply: (
    commentId: string,
    replyId: string,
    updatedFields: Partial<ReplyType>
  ) => void;
};

type StoredState = {
  posts: (Omit<PostType, "createdAt"> & { createdAt: string })[];
  comments: (Omit<CommentType, "createdAt" | "replies"> & {
    createdAt: string;
    replies: (Omit<ReplyType, "createdAt"> & { createdAt: string })[];
  })[];
};

const serializeState = (state: AppState): StoredState => ({
  posts: state.posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    userId: post.userId,
    userName: post.userName,
    userPhotoURL: post.userPhotoURL,
    likes: post.likes,
    repostsCount: post.repostsCount,
    sharesCount: post.sharesCount,
    imageUrl: post.imageUrl,
  })),
  comments: state.comments.map((comment) => ({
    parentId: comment.parentId,
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    userId: comment.userId,
    userName: comment.userName,
    userPhotoURL: comment.userPhotoURL,
    postId: comment.postId,
    likes: comment.likes,
    repostsCount: comment.repostsCount,
    sharesCount: comment.sharesCount,
    replies: comment.replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      userId: reply.userId,
      userName: reply.userName,
      userPhotoURL: reply.userPhotoURL,
      commentId: reply.commentId,
      likes: reply.likes,
      repostsCount: reply.repostsCount,
      sharesCount: reply.sharesCount,
    })),
  })),
});

const deserializeState = (stored: StoredState): AppState => ({
  posts: stored.posts.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
  })),
  comments: stored.comments.map((comment) => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
    replies: comment.replies.map((reply) => ({
      ...reply,
      createdAt: new Date(reply.createdAt),
    })),
  })),
  addPost: () => {},
  updatePost: () => {},
  addComment: () => {},
  updateComment: () => {},
  addReply: () => {},
  updateReply: () => {},
});

const defaultState: AppState = {
  posts: [],
  comments: [],
  addPost: () => {},
  updatePost: () => {},
  addComment: () => {},
  updateComment: () => {},
  addReply: () => {},
  updateReply: () => {},
};

export const useStore = create<AppState>((set) => {
  let initialState = defaultState;

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("appState");
    if (stored) {
      try {
        const parsed: StoredState = JSON.parse(stored);
        initialState = deserializeState(parsed);
      } catch (err) {
        console.error("Failed to parse localStorage state", err);
      }
    }
  }

  return {
    ...initialState,
    addPost: (post) =>
      set((state) => {
        const newState = {
          ...state,
          posts: [post, ...state.posts],
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
    updatePost: (postId, updatedFields) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updatedFields } : post
          ),
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
    addComment: (comment) =>
      set((state) => {
        const newState = {
          ...state,
          comments: [comment, ...state.comments],
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
    updateComment: (commentId, updatedFields) =>
      set((state) => {
        const newState = {
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, ...updatedFields }
              : comment
          ),
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
    addReply: (reply) =>
      set((state) => {
        const newState = {
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === reply.commentId
              ? { ...comment, replies: [reply, ...comment.replies] }
              : comment
          ),
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
    updateReply: (commentId, replyId, updatedFields) =>
      set((state) => {
        const newState = {
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === replyId
                      ? { ...reply, ...updatedFields }
                      : reply
                  ),
                }
              : comment
          ),
        };
        localStorage.setItem(
          "appState",
          JSON.stringify(serializeState(newState))
        );
        return newState;
      }),
  };
});
