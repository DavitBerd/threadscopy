"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import styles from "./createPost.module.scss";
import { useStore } from "../../store/store";
import { UserType, PostType } from "../../types";

interface CreatePostProps {
  user: UserType | null;
}

interface FormData {
  content: string;
}

const CreatePost = ({ user }: CreatePostProps) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPost } = useStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if ((!data.content.trim() && !previewUrl) || !user) return;

    const newPost: PostType = {
      id: `post-${crypto.randomUUID()}`,
      content: data.content,
      imageUrl: previewUrl || undefined,
      createdAt: new Date(),
      userId: user.uid,
      userName: user.displayName || "Anonymous User",
      userPhotoURL: user.photoURL || undefined,
      likes: [],
      repostsCount: 0,
      sharesCount: 0,
    };

    addPost(newPost);
    reset();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowPostModal(false);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setPreviewUrl(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.createPost}>
      <div
        className={styles.postTrigger}
        onClick={() => user && setShowPostModal(true)}
      >
        <div className={styles.header}>
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={40}
              height={40}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {user?.displayName ? user.displayName.charAt(0) : "U"}
            </div>
          )}
          <div className={styles.triggerText}>What&apos;s new?</div>
        </div>
        <button className={styles.postButton}>Post</button>
      </div>
      {showPostModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.postForm}>
              <div className={styles.modalHeader}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
                <h3>New Post</h3>
              </div>

              <div className={styles.postContent}>
                <div className={styles.userInfo}>
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.defaultAvatar}>
                      {user?.displayName ? user.displayName.charAt(0) : "U"}
                    </div>
                  )}
                  <span className={styles.userName}>
                    {user?.displayName || "Anonymous User"}
                  </span>
                </div>

                <textarea
                  placeholder="What's new?"
                  className={styles.textarea}
                  {...register("content", { required: !previewUrl })}
                />

                {errors.content && !previewUrl && (
                  <p className={styles.error}>Please add text or an image</p>
                )}

                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={handleRemoveImage}
                    >
                      ✕
                    </button>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      className={styles.previewImage}
                    />
                  </div>
                )}

                <div className={styles.postActions}>
                  <label className={styles.fileInput}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Add photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!previewUrl && !register("content").name}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
