
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
import DropdownMenu from "@/app/components/dropdownmenu";

interface CommentFormData {
  comment: string;
}

interface EditFormData {
  content: string;
}

export default function PostPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [deletingReplyId, setDeletingReplyId] = useState<{
    commentId: string;
    replyId: string;
  } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<{
    commentId: string;
    replyId: string;
  } | null>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const {
    posts,
    comments,
    addComment,
    updatePost,
    updateComment,
    addReply,
    updateReply,
    deletePost,
    deleteComment,
    deleteReply,
  } = useStore();
  const { register, handleSubmit, reset } = useForm<CommentFormData>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm<EditFormData>();
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

  const handleDeletePost = () => {
    if (!post) return;
    deletePost(post.id);
    router.push("/");
  };

  const handleEditPost = () => {
    setIsEditingPost(true);
    resetEdit({ content: post?.content });
  };

  const onSubmitEditPost = (data: EditFormData) => {
    if (!post) return;
    updatePost(post.id, { content: data.content, updatedAt: new Date() });
    setIsEditingPost(false);
    resetEdit();
  };

  const onCancelEditPost = () => {
    setIsEditingPost(false);
    resetEdit();
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

  const handleDeleteComment = () => {
    if (!deletingCommentId) return;
    deleteComment(deletingCommentId);
    setDeletingCommentId(null);
  };

  const handleDeleteReply = () => {
    if (!deletingReplyId) return;
    deleteReply(deletingReplyId.commentId, deletingReplyId.replyId);
    setDeletingReplyId(null);
  };

  const handleEditComment = (commentId: string) => {
    setEditingCommentId(commentId);
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      resetEdit({ content: comment.content });
    }
  };

  const handleEditReply = (commentId: string, replyId: string) => {
    setEditingReplyId({ commentId, replyId });
    const reply = comments
      .find((c) => c.id === commentId)
      ?.replies.find((r) => r.id === replyId);
    if (reply) {
      resetEdit({ content: reply.content });
    }
  };

  const onSubmitEditComment = (data: EditFormData) => {
    if (!editingCommentId) return;
    updateComment(editingCommentId, { content: data.content, updatedAt: new Date() });
    setEditingCommentId(null);
    resetEdit();
  };

  const onSubmitEditReply = (data: EditFormData) => {
    if (!editingReplyId) return;
    updateReply(editingReplyId.commentId, editingReplyId.replyId, {
      content: data.content,
      updatedAt: new Date(),
    });
    setEditingReplyId(null);
    resetEdit();
  };

  const onCancelEditComment = () => {
    setEditingCommentId(null);
    resetEdit();
  };

  const onCancelEditReply = () => {
    setEditingReplyId(null);
    resetEdit();
  };

  const onSubmitComment = (data: CommentFormData, commentId?: string) => {
    if (!user || !post) return;

    if (commentId) {
      const replyingToComment = comments.find((c) => c.id === commentId);
      const replyingToReply = comments
        .flatMap((c) => c.replies)
        .find((r) => r.id === commentId);
      const targetUserName = replyingToReply
        ? replyingToReply.userName
        : replyingToComment?.userName || "";
      const parentCommentId = replyingToReply
        ? replyingToReply.commentId
        : commentId;

      const newReply: ReplyType = {
        id: `reply-${Date.now()}`,
        content: `@${targetUserName} ${data.comment}`,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        userPhotoURL: user.photoURL || undefined,
        commentId: parentCommentId,
        likes: [],
        repostsCount: 0,
        sharesCount: 0,
      };
      addReply(newReply);
    } else {
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

  const getReplyToUsername = (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (comment) return comment.userName;
    const reply = comments.flatMap((c) => c.replies).find((r) => r.id === id);
    return reply ? reply.userName : "";
  };

  const renderComments = (commentsToRender: CommentType[]) => {
    return commentsToRender.map((comment) => (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentHeader}>
          <div className={styles.commentInfoWrapper}>
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
          </div>
          <DropdownMenu
            itemId={comment.id}
            type="comment"
            isOwner={user ? comment.userId === user.uid : false}
            onDelete={() => setDeletingCommentId(comment.id)}
            onEdit={() => handleEditComment(comment.id)}
            onOptionClick={(option) =>
              console.log(
                `Selected ${option} for comment with ID: ${comment.id}`
              )
            }
          />
        </div>
        {editingCommentId === comment.id ? (
          <form onSubmit={handleSubmitEdit(onSubmitEditComment)} className={styles.editForm}>
            <textarea
              {...registerEdit("content", { required: true })}
              className={styles.editInput}
              defaultValue={comment.content}
            />
            <div className={styles.editButtons}>
              <button type="submit" className={styles.editSubmit}>Save</button>
              <button type="button" onClick={onCancelEditComment} className={styles.editCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className={styles.commentContent}>{comment.content}</div>
        )}
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
              fill={user && comment.likes.includes(user.uid) ? "#f91880" : "none"}
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
                placeholder={`@${comment.userName} `}
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
            {[...comment.replies]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((reply) => (
                <div key={reply.id} className={styles.reply}>
                  <div className={styles.replyHeader}>
                    <div className={styles.replyInfoWrapper}>
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
                        <div className={styles.replyUserName}>
                          {reply.userName}
                        </div>
                        <div className={styles.replyTime}>
                          {getFormattedDate(reply.createdAt)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu
                      itemId={reply.id}
                      type="reply"
                      isOwner={user ? reply.userId === user.uid : false}
                      onDelete={() =>
                        setDeletingReplyId({
                          commentId: comment.id,
                          replyId: reply.id,
                        })
                      }
                      onEdit={() => handleEditReply(comment.id, reply.id)}
                      onOptionClick={(option) =>
                        console.log(
                          `Selected ${option} for reply with ID: ${reply.id}`
                        )
                      }
                    />
                  </div>
                  {editingReplyId?.replyId === reply.id && editingReplyId.commentId === comment.id ? (
                    <form onSubmit={handleSubmitEdit(onSubmitEditReply)} className={styles.editForm}>
                      <textarea
                        {...registerEdit("content", { required: true })}
                        className={styles.editInput}
                        defaultValue={reply.content}
                      />
                      <div className={styles.editButtons}>
                        <button type="submit" className={styles.editSubmit}>Save</button>
                        <button type="button" onClick={onCancelEditReply} className={styles.editCancel}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className={styles.replyContent}>{reply.content}</div>
                  )}
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
                        fill={user && reply.likes.includes(user.uid) ? "#f91880" : "none"}
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
                      onSubmit={handleSubmit((data) => onSubmitComment(data, reply.id))}
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
                          placeholder={`@${getReplyToUsername(reply.id)} `}
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
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingCommentId && (
        <div className={styles.deleteModalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className={styles.deleteModalHeader}>
              <h3>Confirm Delete</h3>
            </div>
            <div className={styles.deleteModalBody}>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </div>
            <div className={styles.deleteModalFooter}>
              <button
                className={styles.deleteCancelButton}
                onClick={() => setDeletingCommentId(null)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteComment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingReplyId && (
        <div className={styles.deleteModalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className={styles.deleteModalHeader}>
              <h3>Confirm Delete</h3>
            </div>
            <div className={styles.deleteModalBody}>
              Are you sure you want to delete this reply? This action cannot be
              undone.
            </div>
            <div className={styles.deleteModalFooter}>
              <button
                className={styles.deleteCancelButton}
                onClick={() => setDeletingReplyId(null)}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteReply}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
            <DropdownMenu
              itemId={post.id}
              type="post"
              isOwner={user ? post.userId === user.uid : false}
              onDelete={() => setShowDeleteModal(true)}
              onEdit={handleEditPost}
              onOptionClick={(option) =>
                console.log(`Selected ${option} for post with ID: ${post.id}`)
              }
            />
          </div>

          {isEditingPost ? (
            <form onSubmit={handleSubmitEdit(onSubmitEditPost)} className={styles.editForm}>
              <textarea
                {...registerEdit("content", { required: true })}
                className={styles.editInput}
                defaultValue={post.content}
              />
              <div className={styles.editButtons}>
                <button type="submit" className={styles.editSubmit}>Save</button>
                <button type="button" onClick={onCancelEditPost} className={styles.editCancel}>Cancel</button>
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
                fill={user && post.likes.includes(user.uid) ? "#f91880" : "none"}
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