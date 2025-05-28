"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./createPost.module.scss";
import { useStore } from "../../store/store";
import { UserType } from "../../types";
import PostCreationWindow from "../postCreationWindow";

type CreatePostProps = {
  user: UserType | null;
};

const CreatePost = ({ user }: CreatePostProps) => {
  const [showModal, setShowModal] = useState(false);
  const { addPost } = useStore();

  return (
    <div className={styles.createPost}>
      <div
        className={styles.postTrigger}
        onClick={() => user && setShowModal(true)}
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
          <div className={styles.triggerText}>What&lsquo;s new?</div>
        </div>
        <button className={styles.postButton}>Post</button>
      </div>
      <PostCreationWindow
        user={user}
        showModal={showModal}
        setShowModal={setShowModal}
        addPost={addPost}
      />
    </div>
  );
};

export default CreatePost;
