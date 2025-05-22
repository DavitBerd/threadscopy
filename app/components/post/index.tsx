"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";

import { PostType, CommentType, UserType } from "../../types";
import styles from "./Post.module.scss";
import { useStore } from "../../store/store";

interface PostProps {
  post: PostType;
  user: UserType | null;
  updatePost: (postId: string, updatedFields: Partial<PostType>) => void;
}

interface CommentFormData {
  comment: string;
}

const Post = ({ post, user, updatePost }: PostProps) => {
  const { comments, addComment } = useStore();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<CommentFormData>();
  const isLiked = post.likes.includes(user?.uid || "");
  const postComments = comments.filter((c) => c.postId === post.id);

  const handleLike = () => {
    if (!user) return;
    const newLikes = isLiked
      ? post.likes.filter((uid) => uid !== user.uid)
      : [...post.likes, user.uid];
    updatePost(post.id, { likes: newLikes });
  };

  const handleRepost = () => {
    if (!user) return;
    updatePost(post.id, { repostsCount: post.repostsCount + 1 });
  };

  const handleShare = () => {
    if (!user) return;
    updatePost(post.id, { sharesCount: post.sharesCount + 1 });
  };

  const onSubmitComment = (data: CommentFormData) => {
    if (!user) return;

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
      replies: []
    };

    addComment(newComment);
    reset();
    setShowCommentForm(false);
  };

  const getFormattedDate = (createdAt: Date) => {
    try {
      return formatDistanceToNow(createdAt, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown time";
    }
  };

  const Menu = ({ itemId }: { itemId: string }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleOptionClick = (option: string) => {
      console.log(`Selected ${option} for post with ID: ${itemId}`);
      setMenuOpen(false);
    };

    return (
      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
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
        {menuOpen && (
          <div className={styles.menuDropdown}>
            <button
              onClick={() => handleOptionClick("Save")}
              className={styles.menuItem}
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
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
            <button
              onClick={() => handleOptionClick("Not interested")}
              className={styles.menuItem}
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
                <path d="M10 15l5-5"></path>
                <path d="M16 15l-5-5"></path>
              </svg>
              Not interested
            </button>
            <button
              onClick={() => handleOptionClick("Mute")}
              className={styles.menuItem}
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
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M15 9l-3 3m0-3l3 3"></path>
              </svg>
              Mute
            </button>
            <button
              onClick={() => handleOptionClick("Block")}
              className={styles.menuItem}
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
              </svg>
              Block
            </button>
            <button
              onClick={() => handleOptionClick("Report")}
              className={styles.menuItem}
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
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
                <path d="M19 10c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
              </svg>
              Report
            </button>
            <button
              onClick={() => handleOptionClick("Copy link")}
              className={styles.menuItem}
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
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Copy link
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
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
        <Menu itemId={post.id} />
      </div>

      <Link href={`/posts/${post.id}`} className={styles.postLink}>
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
      </Link>

      <div className={styles.postActions}>
        <button
          className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{post.likes.length}</span>
        </button>

        <Link href={`/posts/${post.id}`}>
          <button className={styles.actionButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{postComments.length}</span>
          </button>
        </Link>

        <button className={styles.actionButton} onClick={handleRepost}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 1l4 4-4 4"></path>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <path d="M7 23l-4-4 4-4"></path>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          <span>{post.repostsCount}</span>
        </button>

        <button className={styles.actionButton} onClick={handleShare}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>{post.sharesCount}</span>
        </button>
      </div>

      {user && (
        <>
          {showCommentForm && (
            <form
              onSubmit={handleSubmit(onSubmitComment)}
              className={styles.commentForm}
            >
              <input
                type="text"
                placeholder="Write a comment..."
                {...register("comment", { required: true })}
                className={styles.commentInput}
              />
              <button type="submit" className={styles.commentSubmit}>
                Submit
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Post;
