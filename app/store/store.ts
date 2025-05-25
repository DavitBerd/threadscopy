import { create } from "zustand";
import { PostType, CommentType, ReplyType } from "../types/index";

// Type for serialized state in localStorage
type StoredState = {
  posts: (Omit<PostType, "createdAt"> & { createdAt: string })[];
  comments: (Omit<CommentType, "createdAt" | "replies"> & {
    createdAt: string;
    replies: (Omit<ReplyType, "createdAt"> & { createdAt: string })[];
  })[];
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

// Placeholder posts to initialize the store
const placeholderPosts: PostType[] = [
  {
    id: `post-${crypto.randomUUID()}`,
    content: "Welcome to Threads! This is a sample post.",
    createdAt: new Date(),
    userId: "placeholder-user",
    userName: "Threads Team",
    userPhotoURL: "/images/placeholder-user.png",
    likes: [],
    repostsCount: 0,
    sharesCount: 0,
    imageUrl: undefined,
  },
  {
    id: `post-${crypto.randomUUID()}`,
    content: "Check out this cool photo!",
    createdAt: new Date(),
    userId: "placeholder-user",
    userName: "Threads Team",
    userPhotoURL: "/images/placeholder-user.png",
    likes: [],
    repostsCount: 0,
    sharesCount: 0,
    imageUrl: "/images/placeholder-image.jpg",
  },
];

export const useStore = create<AppState>((set) => {
  // Initialize state from localStorage or use placeholder posts
  let initialState: AppState = {
    posts: [],
    comments: [],
    addPost: () => {},
    updatePost: () => {},
    addComment: () => {},
    updateComment: () => {},
    addReply: () => {},
    updateReply: () => {},
  };

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("appState");
    if (stored) {
      try {
        const parsed: StoredState = JSON.parse(stored);
        initialState = {
          ...initialState,
          posts: parsed.posts.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          })),
          comments: parsed.comments.map((comment) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            replies: comment.replies.map((reply) => ({
              ...reply,
              createdAt: new Date(reply.createdAt),
            })),
          })),
        };
      } catch (err) {
        console.error("Failed to parse localStorage state", err);
      }
    } else {
      // If no stored state, initialize with placeholder posts
      initialState.posts = placeholderPosts;
    }
  }

  return {
    ...initialState,
    addPost: (post) =>
      set((state) => {
        const newState = { ...state, posts: [post, ...state.posts] };
        localStorage.setItem(
          "appState",
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
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
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
        );
        return newState;
      }),
    addComment: (comment) =>
      set((state) => {
        const newState = { ...state, comments: [comment, ...state.comments] };
        localStorage.setItem(
          "appState",
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
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
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
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
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
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
          JSON.stringify({
            posts: newState.posts.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
            comments: newState.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
              replies: c.replies.map((r) => ({
                ...r,
                createdAt: r.createdAt.toISOString(),
              })),
            })),
          })
        );
        return newState;
      }),
  };
});
