import { create } from "zustand";

interface PostType {
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

interface CommentType {
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
}

interface ReplyType {
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

interface AppState {
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
}

interface StoredState {
  posts: Array<{
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    userName: string;
    userPhotoURL?: string;
    likes: string[];
    repostsCount: number;
    sharesCount: number;
    imageUrl?: string;
  }>;
  comments: Array<{
    parentId: number;
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    userName: string;
    userPhotoURL?: string;
    postId: string;
    likes: string[];
    repostsCount: number;
    sharesCount: number;
    replies: Array<{
      id: string;
      content: string;
      createdAt: string;
      userId: string;
      userName: string;
      userPhotoURL?: string;
      commentId: string;
      likes: string[];
      repostsCount: number;
      sharesCount: number;
    }>;
  }>;
}

const serializeState = (state: AppState): StoredState => {
  return {
    posts: state.posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    })),
    comments: state.comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      replies: comment.replies.map((reply) => ({
        ...reply,
        createdAt: reply.createdAt.toISOString(),
      })),
    })),
  };
};

const deserializeState = (stored: StoredState): AppState => {
  return {
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
  };
};

const defaultState: AppState = {
  posts: [
    {
      id: "placeholder1",
      content: "Welcome to Threads! This is a sample post to get you started.",
      createdAt: new Date(),
      userId: "sampleUser1",
      userName: "Sample User",
      userPhotoURL: "",
      likes: ["mockUser1", "mockUser2"],
      repostsCount: 0,
      sharesCount: 0,
    },
    {
      id: "placeholder2",
      content: "Another example post! Join the conversation.",
      createdAt: new Date(Date.now() - 3600000),
      userId: "sampleUser2",
      userName: "Jane Doe",
      userPhotoURL: "",
      likes: ["mockUser3"],
      repostsCount: 2,
      sharesCount: 1,
    },
  ],
  comments: [
    {
      id: "comment1",
      content: "Great post!",
      createdAt: new Date(),
      userId: "mockUser1",
      userName: "Commenter One",
      userPhotoURL: undefined,
      postId: "placeholder1",
      likes: ["mockUser2"],
      repostsCount: 0,
      sharesCount: 0,
      replies: [
        {
          id: "reply1",
          content: "Totally agree!",
          createdAt: new Date(),
          userId: "mockUser3",
          userName: "Replier One",
          userPhotoURL: undefined,
          commentId: "comment1",
          likes: [],
          repostsCount: 0,
          sharesCount: 0,
        },
      ],
      parentId: 1234,
    },
    {
      id: "comment2",
      content: "Nice one!",
      createdAt: new Date(),
      userId: "mockUser2",
      userName: "Commenter Two",
      userPhotoURL: undefined,
      postId: "placeholder2",
      likes: [],
      repostsCount: 0,
      sharesCount: 0,
      replies: [],
      parentId: 123,
    },
  ],
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
      } catch (error) {
        console.error("Error parsing localStorage state:", error);
      }
    }
  }

  return {
    ...initialState,
    addPost: (post) =>
      set((state) => {
        const newState = {
          posts: [post, ...state.posts],
          comments: state.comments,
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
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updatedFields } : post
          ),
          comments: state.comments,
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
          posts: state.posts,
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
          posts: state.posts,
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
          posts: state.posts,
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
          posts: state.posts,
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
