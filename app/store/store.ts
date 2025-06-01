import { create } from "zustand";
import { PostType, CommentType, ReplyType } from "../types";
import img1 from "../../public/imgs/240_F_125645329_Pc6Rn1soUuAZyHgp4DYxXKUXITSFCc1R.jpg";
import img2 from "../../public/imgs/istockphoto-649889910-612x612.jpg";
import img3 from "../../public/imgs/pexels-photo-3076899.jpeg";

type AppState = {
  posts: PostType[];
  comments: CommentType[];
  followedUsers: string[]; // Add this to track followed users
  openDropdownId: string | null;
  addPost: (post: PostType) => void;
  updatePost: (postId: string, updatedFields: Partial<PostType>) => void;
  deletePost: (postId: string) => void;
  addComment: (comment: CommentType) => void;
  updateComment: (
    commentId: string,
    updatedFields: Partial<CommentType>
  ) => void;
  deleteComment: (commentId: string) => void;
  addReply: (reply: ReplyType) => void;
  updateReply: (
    commentId: string,
    replyId: string,
    updatedFields: Partial<ReplyType>
  ) => void;
  deleteReply: (commentId: string, replyId: string) => void;
  openDropdown: (itemId: string) => void;
  closeDropdown: () => void;
  // Add follow/unfollow functions
  followUser: (userName: string) => void;
  unfollowUser: (userName: string) => void;
  isFollowing: (userName: string) => boolean;
};

const placeholderPosts: PostType[] = [
  {
    id: "post-1",
    content:
      "Just finished reading 'The Seven Husbands of Evelyn Hugo' and I'm emotionally destroyed in the best way possible 😭📚 Anyone else ugly cry at the ending?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: "user-bookworm",
    userName: "Sarah Chen",
    userPhotoURL: undefined,
    likes: ["user-1", "user-2", "user-3", "user-4", "user-5"],
    repostsCount: 12,
    sharesCount: 3,
    imageUrl: img1,
    comments: [
      {
        id: "comment-1",
        content: "I totally agree with you! That book wrecked me!",
        createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        userId: "user-26",
        userName: "Lisa Nguyen",
        userPhotoURL: undefined,
        postId: "post-1",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [
          {
            id: "reply-1",
            content: "@Lisa Nguyen Same! The last chapter had me sobbing.",
            createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
            userId: "user-27",
            userName: "Ryan Patel",
            userPhotoURL: undefined,
            commentId: "comment-1",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
          {
            id: "reply-2",
            content: "@Lisa Nguyen I couldn't put it down!",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            userId: "user-28",
            userName: "Olivia Brown",
            userPhotoURL: undefined,
            commentId: "comment-1",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
        ],
      },
      {
        id: "comment-2",
        content: "Wow, this is next level!",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        userId: "user-29",
        userName: "Chris Evans",
        userPhotoURL: undefined,
        postId: "post-1",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [],
      },
    ],
  },
  {
    id: "post-2",
    content: "Golden hour hits different when you're 30,000 feet up ✈️✨",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userId: "user-traveler",
    userName: "Alex Rodriguez",
    userPhotoURL: undefined,
    likes: ["user-6", "user-7", "user-8"],
    repostsCount: 8,
    sharesCount: 15,

    comments: [
      {
        id: "comment-3",
        content: "This is so relatable!",
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        userId: "user-30",
        userName: "Sophie Lee",
        userPhotoURL: undefined,
        postId: "post-2",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [
          {
            id: "reply-3",
            content: "@Sophie Lee Totally agree! The view is unreal.",
            createdAt: new Date(Date.now() - 3.2 * 60 * 60 * 1000),
            userId: "user-31",
            userName: "Tara Smith",
            userPhotoURL: undefined,
            commentId: "comment-3",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
        ],
      },
    ],
  },
  {
    id: "post-3",
    content:
      "PSA: Your houseplants are not dying because you're a bad plant parent. Sometimes plants just decide to be dramatic. Looking at you, fiddle leaf fig 🌱😤",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    userId: "user-plantmom",
    userName: "Maya Patel",
    userPhotoURL: undefined,
    likes: ["user-9", "user-10", "user-11", "user-12"],
    repostsCount: 24,
    sharesCount: 7,
    imageUrl: img3,
    comments: [
      {
        id: "comment-4",
        content: "My fiddle leaf is such a drama queen!",
        createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
        userId: "user-32",
        userName: "James Wilson",
        userPhotoURL: undefined,
        postId: "post-3",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [
          {
            id: "reply-4",
            content:
              "@James Wilson Same! It drops leaves if I look at it wrong.",
            createdAt: new Date(Date.now() - 5.3 * 60 * 60 * 1000),
            userId: "user-33",
            userName: "Natalie Garcia",
            userPhotoURL: undefined,
            commentId: "comment-4",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
          {
            id: "reply-5",
            content: "@James Wilson I feel this so much!",
            createdAt: new Date(Date.now() - 5.1 * 60 * 60 * 1000),
            userId: "user-34",
            userName: "David Kim",
            userPhotoURL: undefined,
            commentId: "comment-4",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
        ],
      },
    ],
  },
  {
    id: "post-4",
    content:
      "Homemade ramen for a rainy Sunday 🍜 Nothing beats the satisfaction of making your own broth from scratch!",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    userId: "user-chef",
    userName: "Jordan Kim",
    userPhotoURL: undefined,
    likes: ["user-13", "user-14", "user-15", "user-16", "user-17", "user-18"],
    repostsCount: 5,
    sharesCount: 22,
    comments: [
      {
        id: "comment-5",
        content: "Share the recipe please!",
        createdAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
        userId: "user-26",
        userName: "Lisa Nguyen",
        userPhotoURL: undefined,
        postId: "post-4",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [
          {
            id: "reply-6",
            content: "@Lisa Nguyen Yes, please share! Looks amazing.",
            createdAt: new Date(Date.now() - 7.3 * 60 * 60 * 1000),
            userId: "user-27",
            userName: "Ryan Patel",
            userPhotoURL: undefined,
            commentId: "comment-5",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
        ],
      },
    ],
  },
  {
    id: "post-5",
    content:
      "Hot take: The best part of working from home isn't the pajamas or avoiding commute traffic. It's being able to dance badly to my music between meetings without judgment 💃🕺",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    userId: "user-wfh",
    userName: "Emma Thompson",
    userPhotoURL: undefined,
    likes: ["user-19", "user-20", "user-21"],
    repostsCount: 31,
    sharesCount: 9,
    comments: [
      {
        id: "comment-6",
        content: "This is so true! Dance breaks are the best.",
        createdAt: new Date(Date.now() - 9.5 * 60 * 60 * 1000),
        userId: "user-28",
        userName: "Olivia Brown",
        userPhotoURL: undefined,
        postId: "post-5",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [],
      },
    ],
  },
  {
    id: "post-6",
    content:
      "My cat has decided that my keyboard is the perfect napping spot every time I try to work. I'm convinced this is revenge for switching to the automatic feeder 😾⌨️",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    userId: "user-catdad",
    userName: "Marcus Williams",
    userPhotoURL: undefined,
    likes: ["user-22", "user-23", "user-24", "user-25"],
    repostsCount: 18,
    sharesCount: 4,
    imageUrl: img2,
    comments: [
      {
        id: "comment-7",
        content: "My cat does the same thing!",
        createdAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
        userId: "user-29",
        userName: "Chris Evans",
        userPhotoURL: undefined,
        postId: "post-6",
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
        parentId: 0,
        replies: [
          {
            id: "reply-7",
            content: "@Chris Evans It's like they plan it!",
            createdAt: new Date(Date.now() - 11.3 * 60 * 60 * 1000),
            userId: "user-30",
            userName: "Sophie Lee",
            userPhotoURL: undefined,
            commentId: "comment-7",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
          {
            id: "reply-8",
            content: "@Chris Evans Cats and keyboards, eternal enemies.",
            createdAt: new Date(Date.now() - 11.1 * 60 * 60 * 1000),
            userId: "user-31",
            userName: "Tara Smith",
            userPhotoURL: undefined,
            commentId: "comment-7",
            likes: [],
            repostsCount: 0,
            sharesCount: 0,
          },
        ],
      },
    ],
  },
];

const placeholderComments: CommentType[] = placeholderPosts.flatMap(
  (post) => post.comments || []
);

const saveToStorage = (
  state: Pick<AppState, "posts" | "comments" | "followedUsers">
) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      "appState",
      JSON.stringify({
        posts: state.posts.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          comments: p.comments?.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            replies: c.replies.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            })),
          })),
        })),
        comments: state.comments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          replies: c.replies.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
          })),
        })),
        followedUsers: state.followedUsers,
      })
    );
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
};

const loadFromStorage = (): Pick<
  AppState,
  "posts" | "comments" | "followedUsers"
> => {
  if (typeof window === "undefined") {
    return { posts: [], comments: [], followedUsers: [] };
  }

  const stored = localStorage.getItem("appState");
  if (!stored) {
    return {
      posts: placeholderPosts,
      comments: placeholderComments,
      followedUsers: [],
    };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      posts:
        parsed.posts?.map(
          (
            post: PostType & {
              createdAt: string;
              comments: (CommentType & {
                createdAt: string;
                replies: (ReplyType & { createdAt: string })[];
              })[];
            }
          ) => ({
            ...post,
            createdAt: new Date(post.createdAt),
            comments:
              post.comments?.map((comment) => ({
                ...comment,
                createdAt: new Date(comment.createdAt),
                replies:
                  comment.replies?.map((reply) => ({
                    ...reply,
                    createdAt: new Date(reply.createdAt),
                  })) || [],
              })) || [],
          })
        ) || [],
      comments:
        parsed.comments?.map(
          (
            comment: CommentType & {
              createdAt: string;
              replies: (ReplyType & { createdAt: string })[];
            }
          ) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            replies:
              comment.replies?.map((reply) => ({
                ...reply,
                createdAt: new Date(reply.createdAt),
              })) || [],
          })
        ) || [],
      followedUsers: parsed.followedUsers || [],
    };
  } catch (err) {
    console.error("Failed to parse localStorage state", err);
    return {
      posts: placeholderPosts,
      comments: placeholderComments,
      followedUsers: [],
    };
  }
};

export const useStore = create<AppState>((set, get) => {
  const initialState = loadFromStorage();

  return {
    ...initialState,
    openDropdownId: null,

    // Follow/unfollow functions
    followUser: (userName) =>
      set((state) => {
        const newFollowedUsers = [...state.followedUsers, userName];
        const newState = { ...state, followedUsers: newFollowedUsers };
        saveToStorage(newState);
        return newState;
      }),

    unfollowUser: (userName) =>
      set((state) => {
        const newFollowedUsers = state.followedUsers.filter(
          (name) => name !== userName
        );
        const newState = { ...state, followedUsers: newFollowedUsers };
        saveToStorage(newState);
        return newState;
      }),

    isFollowing: (userName) => {
      return get().followedUsers.includes(userName);
    },

    addPost: (post) =>
      set((state) => {
        const newState = { ...state, posts: [post, ...state.posts] };
        saveToStorage(newState);
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
        saveToStorage(newState);
        return newState;
      }),

    deletePost: (postId) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.filter((post) => post.id !== postId),
          comments: state.comments.filter(
            (comment) => comment.postId !== postId
          ),
        };
        saveToStorage(newState);
        return newState;
      }),

    addComment: (comment) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) =>
            post.id === comment.postId
              ? { ...post, comments: [...(post.comments || []), comment] }
              : post
          ),
          comments: [comment, ...state.comments],
        };
        saveToStorage(newState);
        return newState;
      }),

    updateComment: (commentId, updatedFields) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) => ({
            ...post,
            comments: post.comments?.map((comment) =>
              comment.id === commentId
                ? { ...comment, ...updatedFields }
                : comment
            ),
          })),
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, ...updatedFields }
              : comment
          ),
        };
        saveToStorage(newState);
        return newState;
      }),

    deleteComment: (commentId) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) => ({
            ...post,
            comments: post.comments?.filter(
              (comment) => comment.id !== commentId
            ),
          })),
          comments: state.comments.filter(
            (comment) => comment.id !== commentId
          ),
        };
        saveToStorage(newState);
        return newState;
      }),

    addReply: (reply) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) => ({
            ...post,
            comments: post.comments?.map((comment) =>
              comment.id === reply.commentId
                ? {
                    ...comment,
                    replies: [...comment.replies, reply].sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                    ),
                  }
                : comment
            ),
          })),
          comments: state.comments.map((comment) =>
            comment.id === reply.commentId
              ? {
                  ...comment,
                  replies: [...comment.replies, reply].sort(
                    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                  ),
                }
              : comment
          ),
        };
        saveToStorage(newState);
        return newState;
      }),

    updateReply: (commentId, replyId, updatedFields) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) => ({
            ...post,
            comments: post.comments?.map((comment) =>
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
          })),
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
        saveToStorage(newState);
        return newState;
      }),

    deleteReply: (commentId, replyId) =>
      set((state) => {
        const newState = {
          ...state,
          posts: state.posts.map((post) => ({
            ...post,
            comments: post.comments?.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.filter(
                      (reply) => reply.id !== replyId
                    ),
                  }
                : comment
            ),
          })),
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.id !== replyId
                  ),
                }
              : comment
          ),
        };
        saveToStorage(newState);
        return newState;
      }),

    openDropdown: (itemId) =>
      set((state) => ({
        ...state,
        openDropdownId: itemId,
      })),

    closeDropdown: () =>
      set((state) => ({
        ...state,
        openDropdownId: null,
      })),
  };
});
