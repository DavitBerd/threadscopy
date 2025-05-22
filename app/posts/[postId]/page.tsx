"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import styles from "./Postpage.module.scss";
import { useStore } from "@/app/store/store";
import { auth } from "@/app/firebase/config";
import Sidebar from "@/app/components/Sidebar";
import { UserType, CommentType, ReplyType } from "../../types";

interface CommentFormData {
  comment: string;
}

export default function PostPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const {
    posts,
    comments,
    addComment,
    updatePost,
    updateComment,
    addReply,
    updateReply,
  } = useStore();
  const { register, handleSubmit, reset } = useForm<CommentFormData>();
  const router = useRouter();
  const { postId } = useParams();

  const post = posts.find((p) => p.id === postId);
  const postComments = comments.filter((c) => c.postId === postId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as UserType | null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!post && !loading) {
      router.push("/");
    }
  }, [post, loading, router]);

  const handleLikePost = () => {
    if (!user || !post) return;
    const newLikes = post.likes.includes(user.uid)
      ? post.likes.filter((uid) => uid !== user.uid)
      : [...post.likes, user.uid];
    updatePost(post.id, { likes: newLikes });
  };

  const handleRepostPost = () => {
    if (!user || !post) return;
    updatePost(post.id, { repostsCount: post.repostsCount + 1 });
  };

  const handleSharePost = () => {
    if (!user || !post) return;
    updatePost(post.id, { sharesCount: post.sharesCount + 1 });
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) return;
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    const newLikes = comment.likes.includes(user.uid)
      ? comment.likes.filter((uid) => uid !== user.uid)
      : [...comment.likes, user.uid];
    updateComment(commentId, { likes: newLikes });
  };

  const handleRepostComment = (commentId: string) => {
    if (!user) return;
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    updateComment(commentId, { repostsCount: comment.repostsCount + 1 });
  };

  const handleShareComment = (commentId: string) => {
    if (!user) return;
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    updateComment(commentId, { sharesCount: comment.sharesCount + 1 });
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    if (!user) return;
    const reply = comments
      .find((c) => c.id === commentId)
      ?.replies.find((r) => r.id === replyId);
    if (!reply) return;
    const newLikes = reply.likes.includes(user.uid)
      ? reply.likes.filter((uid) => uid !== user.uid)
      : [...reply.likes, user.uid];
    updateReply(commentId, replyId, { likes: newLikes });
  };

  const handleRepostReply = (commentId: string, replyId: string) => {
    if (!user) return;
    const reply = comments
      .find((c) => c.id === commentId)
      ?.replies.find((r) => r.id === replyId);
    if (!reply) return;
    updateReply(commentId, replyId, { repostsCount: reply.repostsCount + 1 });
  };

  const handleShareReply = (commentId: string, replyId: string) => {
    if (!user) return;
    const reply = comments
      .find((c) => c.id === commentId)
      ?.replies.find((r) => r.id === replyId);
    if (!reply) return;
    updateReply(commentId, replyId, { sharesCount: reply.sharesCount + 1 });
  };

  const onSubmitComment = (data: CommentFormData, commentId?: string) => {
    if (!user || !post) return;

    const newComment: CommentType = {
      id: `comment-${Date.now()}`,
      content: data.comment,
      createdAt: new Date(),
      userId: user.uid,
      userName: user.displayName || "Anonymous User",
      userPhotoURL: user.photoURL || undefined,
      postId: post.id,
      likes: [],
      repostsCount: 0,
      sharesCount: 0,
      replies: [],
      parentId: 0,
    };

    if (commentId) {
      const newReply: ReplyType = {
        id: `reply-${Date.now()}`,
        content: data.comment,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        userPhotoURL: user.photoURL || undefined,
        commentId,
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
      };
      addReply(newReply);
    } else {
      addComment(newComment);
    }

    reset();
    setReplyingTo(null);
  };

  const getFormattedDate = (createdAt: Date) => {
    try {
      return formatDistanceToNow(createdAt, { addSuffix: true });
    } catch (error) {
      console.log(error);
      return "Unknown time";
    }
  };

  const Menu = ({
    itemId,
    type,
  }: {
    itemId: string;
    type: "post" | "comment" | "reply";
  }) => {
    const handleOptionClick = (option: string) => {
      console.log(`Selected ${option} for ${type} with ID: ${itemId}`);
      setMenuOpen(null);
    };

    return (
      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(menuOpen === itemId ? null : itemId)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="6" r="1"></circle>
            <circle cx="12" cy="18" r="1"></circle>
          </svg>
        </button>
        {menuOpen === itemId && (
          <div className={styles.menuDropdown}>
            <button
              onClick={() => handleOptionClick("Save")}
              className={styles.menuItem}
            >
              Save
            </button>
            <button
              onClick={() => handleOptionClick("Not interested")}
              className={styles.menuItem}
            >
              Not interested
            </button>
            <button
              onClick={() => handleOptionClick("Mute")}
              className={styles.menuItem}
            >
              Mute
            </button>
            <button
              onClick={() => handleOptionClick("Block")}
              className={styles.menuItem}
            >
              Block
            </button>
            <button
              onClick={() => handleOptionClick("Report")}
              className={styles.menuItem}
            >
              Report
            </button>
            <button
              onClick={() => handleOptionClick("Copy link")}
              className={styles.menuItem}
            >
              Copy link
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComments = (commentsToRender: CommentType[]) => {
    return commentsToRender.map((comment) => (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentHeader}>
          {comment.userPhotoURL ? (
            <Image
              src={comment.userPhotoURL}
              alt={comment.userName}
              width={30}
              height={30}
              className={styles.commentAvatar}
            />
          ) : (
            <div className={styles.defaultCommentAvatar}>
              {comment.userName.charAt(0)}
            </div>
          )}
          <div className={styles.commentInfo}>
            <div className={styles.commentUserName}>{comment.userName}</div>
            <div className={styles.commentTime}>
              {getFormattedDate(comment.createdAt)}
            </div>
          </div>
          <Menu itemId={comment.id} type="comment" />
        </div>
        <div className={styles.commentContent}>{comment.content}</div>
        <div className={styles.commentActions}>
          <button
            className={`${styles.actionButton} ${
              user && comment.likes.includes(user.uid) ? styles.liked : ""
            }`}
            onClick={() => handleLikeComment(comment.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={
                user && comment.likes.includes(user.uid) ? "#f91880" : "none"
              }
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{comment.likes.length}</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setReplyingTo(comment.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{comment.replies.length}</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleRepostComment(comment.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M17 1l4 4-4 4"></path>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <path d="M7 23l-4-4 4-4"></path>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
            <span>{comment.repostsCount}</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleShareComment(comment.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <span>{comment.sharesCount}</span>
          </button>
        </div>
        {replyingTo === comment.id && user && (
          <form
            onSubmit={handleSubmit((data) => onSubmitComment(data, comment.id))}
            className={styles.replyForm}
          >
            <div className={styles.replyInputWrapper}>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={24}
                  height={24}
                  className={styles.replyAvatar}
                />
              ) : (
                <div className={styles.defaultReplyAvatar}>
                  {user.displayName ? user.displayName.charAt(0) : "U"}
                </div>
              )}
              <input
                type="text"
                placeholder={`Reply to ${comment.userName}...`}
                {...register("comment", { required: true })}
                className={styles.replyInput}
              />
              <button type="submit" className={styles.replySubmit}>
                Reply
              </button>
            </div>
          </form>
        )}
        {comment.replies.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map((reply) => (
              <div key={reply.id} className={styles.reply}>
                <div className={styles.replyHeader}>
                  {reply.userPhotoURL ? (
                    <Image
                      src={reply.userPhotoURL}
                      alt={reply.userName}
                      width={24}
                      height={24}
                      className={styles.replyAvatar}
                    />
                  ) : (
                    <div className={styles.defaultReplyAvatar}>
                      {reply.userName.charAt(0)}
                    </div>
                  )}
                  <div className={styles.replyInfo}>
                    <div className={styles.replyUserName}>{reply.userName}</div>
                    <div className={styles.replyTime}>
                      {getFormattedDate(reply.createdAt)}
                    </div>
                  </div>
                  <Menu itemId={reply.id} type="reply" />
                </div>
                <div className={styles.replyContent}>{reply.content}</div>
                <div className={styles.replyActions}>
                  <button
                    className={`${styles.actionButton} ${
                      user && reply.likes.includes(user.uid) ? styles.liked : ""
                    }`}
                    onClick={() => handleLikeReply(comment.id, reply.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={
                        user && reply.likes.includes(user.uid)
                          ? "#f91880"
                          : "none"
                      }
                      stroke="#888"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{reply.likes.length}</span>
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => setReplyingTo(reply.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#888"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>0</span>
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleRepostReply(comment.id, reply.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#888"
                      strokeWidth="2"
                    >
                      <path d="M17 1l4 4-4 4"></path>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <path d="M7 23l-4-4 4-4"></path>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                    <span>{reply.repostsCount}</span>
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleShareReply(comment.id, reply.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#888"
                      strokeWidth="2"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    <span>{reply.sharesCount}</span>
                  </button>
                </div>
                {replyingTo === reply.id && user && (
                  <form
                    onSubmit={handleSubmit((data) =>
                      onSubmitComment(data, comment.id)
                    )}
                    className={styles.replyForm}
                  >
                    <div className={styles.replyInputWrapper}>
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={24}
                          height={24}
                          className={styles.replyAvatar}
                        />
                      ) : (
                        <div className={styles.defaultReplyAvatar}>
                          {user.displayName ? user.displayName.charAt(0) : "U"}
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder={`Reply to ${reply.userName}...`}
                        {...register("comment", { required: true })}
                        className={styles.replyInput}
                      />
                      <button type="submit" className={styles.replySubmit}>
                        Reply
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar user={user} />
        <main className={styles.main}>
          <div className={styles.loading}>Loading...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <Sidebar user={user} />
        <main className={styles.main}>
          <div className={styles.error}>Post not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar user={user} />

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back
          </Link>
          <h1 className={styles.title}>Post</h1>
        </div>

        <div className={styles.post}>
          <div className={styles.postHeader}>
            <div className={styles.userInfo}>
              {post.userPhotoURL ? (
                <Image
                  src={post.userPhotoURL}
                  alt={post.userName}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.defaultAvatar}>
                  {post.userName.charAt(0)}
                </div>
              )}
              <div>
                <div className={styles.userName}>{post.userName}</div>
                <div className={styles.postTime}>
                  {getFormattedDate(post.createdAt)}
                </div>
              </div>
            </div>
            <Menu itemId={post.id} type="post" />
          </div>

          <div className={styles.postContent}>{post.content}</div>

          {post.imageUrl && (
            <div className={styles.postImage}>
              <Image
                src={post.imageUrl}
                alt="Post image"
                layout="responsive"
                width={500}
                height={300}
                className={styles.image}
              />
            </div>
          )}

          <div className={styles.postActions}>
            <button
              className={`${styles.actionButton} ${
                user && post.likes.includes(user.uid) ? styles.liked : ""
              }`}
              onClick={handleLikePost}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={
                  user && post.likes.includes(user.uid) ? "#f91880" : "none"
                }
                stroke="#888"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{post.likes.length}</span>
            </button>

            <button className={styles.actionButton} disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{postComments.length}</span>
            </button>

            <button className={styles.actionButton} onClick={handleRepostPost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="2"
              >
                <path d="M17 1l4 4-4 4"></path>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <path d="M7 23l-4-4 4-4"></path>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
              <span>{post.repostsCount}</span>
            </button>

            <button className={styles.actionButton} onClick={handleSharePost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span>{post.sharesCount}</span>
            </button>
          </div>

          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>
              Comments ({postComments.length})
            </h3>

            {postComments.length > 0 ? (
              renderComments(postComments)
            ) : (
              <div className={styles.noComments}>
                No comments yet. Be the first to reply!
              </div>
            )}

            {user && !replyingTo && (
              <form
                onSubmit={handleSubmit((data) => onSubmitComment(data))}
                className={styles.commentForm}
              >
                <div className={styles.commentInputWrapper}>
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={32}
                      height={32}
                      className={styles.commentAvatar}
                    />
                  ) : (
                    <div className={styles.defaultCommentAvatar}>
                      {user.displayName ? user.displayName.charAt(0) : "U"}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder={`Reply to ${post.userName}...`}
                    {...register("comment", { required: true })}
                    className={styles.commentInput}
                  />
                  <button type="submit" className={styles.commentSubmit}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
