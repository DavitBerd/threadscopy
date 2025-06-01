"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";

import { PostType, CommentType, UserType } from "../../types";
import styles from "./Post.module.scss";
import { useStore } from "../../store/store";
import DropdownMenu from "../dropdownmenu";

type PostProps = {
  post: PostType;
  user: UserType | null;
  updatePost: (postId: string, updatedFields: Partial<PostType>) => void;
};

type CommentFormData = {
  comment: string;
};

type EditFormData = {
  content: string;
};

const Post = ({ post, user, updatePost }: PostProps) => {
  const { comments, addComment, deletePost } = useStore();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<CommentFormData>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm<EditFormData>({
    defaultValues: { content: post.content },
  });
  const isLiked = user ? post.likes.includes(user.uid) : false;
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

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmitEdit = (data: EditFormData) => {
    updatePost(post.id, { content: data.content, updatedAt: new Date() });
    setIsEditing(false);
    resetEdit();
  };

  const onCancelEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsEditing(false);
    resetEdit();
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
      replies: [],
      parentId: 0,
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

  return (
    <div className={styles.post}>
      {showDeleteModal && (
        <div className={styles.deleteModalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className={styles.deleteModalHeader}>
              <h3>Confirm Delete</h3>
            </div>
            <div className={styles.deleteModalBody}>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </div>
            <div className={styles.deleteModalFooter}>
              <button
                className={styles.deleteCancelButton}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.avatarContainer}>
        {post.userPhotoURL ? (
          <Image
            src={post.userPhotoURL}
            alt={post.userName}
            width={40}
            height={40}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.defaultAvatar}>{post.userName.charAt(0)}</div>
        )}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.postHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{post.userName}</div>
            <div className={styles.postTime}>
              {getFormattedDate(post.createdAt)}
            </div>
          </div>
          <DropdownMenu
            itemId={post.id}
            type="post"
            isOwner={user ? post.userId === user.uid : false}
            onDelete={() => setShowDeleteModal(true)}
            onEdit={handleEdit}
            onOptionClick={(option) =>
              console.log(`Selected ${option} for post with ID: ${post.id}`)
            }
          />
        </div>

        <Link href={`/pages/posts/${post.id}`} className={styles.postLink}>
          {isEditing ? (
            <form
              onSubmit={handleSubmitEdit(onSubmitEdit)}
              className={styles.editForm}
            >
              <textarea
                {...registerEdit("content", { required: true })}
                className={styles.editInput}
                defaultValue={post.content}
              />
              <div className={styles.editButtons}>
                <button type="submit" className={styles.editSubmit}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className={styles.editCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.postContent}>{post.content}</div>
          )}
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
    </div>
  );
};
export default Post;
